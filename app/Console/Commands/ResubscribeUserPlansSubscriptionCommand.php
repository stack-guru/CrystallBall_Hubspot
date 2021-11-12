<?php

namespace App\Console\Commands;

use App\Events\UserTrialPricePlanEnded;
use App\Mail\AdminFailedPaymentTransactionMail;
use App\Mail\UserFailedPaymentTransactionMail;
use App\Models\Admin;
use App\Models\AutoPaymentLog;
use App\Models\NotificationSetting;
use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use App\Models\User;
use App\Models\WebMonitor;
use App\Services\BlueSnapService;
use App\Services\SendGridService;
use App\Services\UptimeRobotService;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class ResubscribeUserPlansSubscriptionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:resubscribe-user-plans';

    private $freePlan;
    private $freePlanId;
    private $nextExpiryDate;
    private $currentDate;
    private $admin;
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will gather all expired plans and try to resubscribe them. It will also renew free plans.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $freePlan = PricePlan::where('price', 0)->where('name', '<>', 'Trial')->first();
        if ($freePlan) {
            $this->freePlanId = $freePlan->id;
            $this->freePlan = $freePlan;
        }
        $admin = Admin::first();
        if ($admin) {
            $this->admin = $admin;
        }
        $this->nextExpiryDate = new \DateTime("+1 month");
        $this->currentDate = new \DateTime();

        $this->resubscribeFreePlanUsers();
        $this->resubscribePaidPlanUsers();

        // ->update([
        //     'price_plan_id' => PricePlan::where('price', 0.00)->where('is_enabled', true)->first()->id,
        //     'price_plan_expiry_date' => new \DateTime("+1 month")
        // ]);
        //return count($users);
    }

    private function resubscribePaidPlanUsers()
    {
        $users = User::select('users.*')->where('price_plan_expiry_date', '<', new \DateTime)
            ->where('price_plans.price', '<>', 0)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->with('pricePlan')
            ->with('lastPaymentDetail')
            ->get();

        $blueSnapService = new BlueSnapService;
        foreach ($users as $user) {
            $lastPaymentDetail = $user->lastPaymentDetail;
            $lastPricePlanSubscription = $user->lastPricePlanSubscription;

            if ($lastPaymentDetail && $user->is_billing_enabled) {
                $card = [
                    'cardNumber' => $lastPaymentDetail->cardNumber,
                    'expirationMonth' => $lastPaymentDetail->expiry_month,
                    'expirationYear' => $lastPaymentDetail->expiry_year,
                    'securityCode' => $lastPaymentDetail->security_code,
                ];
                $pricePlanPrice = $user->pricePlan->price;

                $isCouponApplied = false;
                if ($lastPricePlanSubscription->coupon && $lastPricePlanSubscription->left_coupon_recurring > 0) {
                    $isCouponApplied = true;
                    $coupon = $lastPricePlanSubscription->coupon;
                    $pricePlanPrice = $pricePlanPrice - (($coupon->discount_percent / 100) * $pricePlanPrice);
                }

                if (array_search($lastPaymentDetail->country, ["PK", "IL"]) !== false) {
                    $pricePlanPrice = $pricePlanPrice + ((17 / 100) * $pricePlanPrice);
                }

                $pricePlanPrice = round($pricePlanPrice, 2);
                $responseArr = $blueSnapService->createTransaction($pricePlanPrice, $card, $lastPaymentDetail->bluesnap_vaulted_shopper_id);
                if ($responseArr['success'] == false) {
                    // Downgrading user to free plan
                    $this->addTransactionToLog($user->id, $user->price_plan_id, null, $lastPaymentDetail->id, $lastPaymentDetail->card_number, $responseArr['message'], $pricePlanPrice, false);
                    $this->subscribeUserToPlan($user, $this->freePlanId);
                    $this->removeAdditionalWebMonitors($user, $this->freePlan->web_monitor_count);
                    $this->disableDataSources($user);
                    $this->disableNotifications($user);
                    Mail::to($this->admin)->send(new AdminFailedPaymentTransactionMail($lastPaymentDetail, $this->admin));
                    Mail::to($user)->send(new UserFailedPaymentTransactionMail($lastPaymentDetail));
                } else {
                    // Continuing user paid plan
                    // checking if recurring coupon applied
                    if ($isCouponApplied) {
                        $pricePlanSubscriptionId = $this->addPricePlanSubscription($responseArr['transactionId'], $user->id, $lastPaymentDetail->id, $user->price_plan_id, $pricePlanPrice, $coupon->id, $coupon->recurring_discount_count - 1);
                    } else {
                        $pricePlanSubscriptionId = $this->addPricePlanSubscription($responseArr['transactionId'], $user->id, $lastPaymentDetail->id, $user->price_plan_id, $pricePlanPrice);
                    }
                    $this->addTransactionToLog($user->id, $user->price_plan_id, $pricePlanSubscriptionId, $lastPaymentDetail->id, $lastPaymentDetail->card_number, null, $pricePlanPrice, true);
                    $this->subscribeUserToPlan($user, $user->price_plan_id);
                }
            } else {
                // Downgrading user to free plan
                if (!$user->user_id) {
                    $this->subscribeUserToPlan($user, $this->freePlanId);
                    $this->removeAdditionalWebMonitors($user, $this->freePlan->web_monitor_count);
                    $this->disableDataSources($user);
                    $this->disableNotifications($user);
                }
            }
        }
        // update([
        //     'users.price_plan_expiry_date' => new \DateTime("+1 month"),
        // ]);

        print count($users) . " Users have been resubscribed to their paid plans.\n";
    }

    private function resubscribeFreePlanUsers()
    {
        $sGS = new SendGridService;

        // Trial users moving to free plan
        $trialUsers = User::where('price_plan_expiry_date', '<', new \DateTime)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->where('price_plans.price', 0)
            ->where('price_plans.name', 'Trial')
            ->get();

        foreach ($trialUsers as $trialUser) {
            $trialUser->price_plan_expiry_date = $this->nextExpiryDate;
            $trialUser->price_plan_id = $this->freePlanId;

            $this->removeAdditionalWebMonitors($trialUser, $this->freePlan->web_monitor_count);
            $this->disableDataSources($trialUser);
            $this->disableNotifications($trialUser);

            $trialUser->trial_ended_at = $this->currentDate;

            $trialUser->save();

            event(new UserTrialPricePlanEnded($trialUser));
        }
        print count($trialUsers) . " Users have been subscribed from trial to free plan.\n";

        // Free plan users resubscribing to free plan with new expiry dates
        $updateCount = User::where('price_plan_expiry_date', '<', new \DateTime)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->where('price_plans.price', 0)
            ->update([
                'users.price_plan_expiry_date' => $this->nextExpiryDate,
                'users.price_plan_id' => $this->freePlanId,

                'users.is_ds_holidays_enabled' => false,
                'users.is_ds_google_algorithm_updates_enabled' => false,
                'users.is_ds_retail_marketing_enabled' => false,
                'users.is_ds_google_alerts_enabled' => false,
                'users.is_ds_weather_alerts_enabled' => false,
                'users.is_ds_wordpress_updates_enabled' => false,
                'users.is_ds_web_monitors_enabled' => false,
            ]);

        print "$updateCount Users have been resubscribed to their free plans.\n";
    }

    private function addPricePlanSubscription($transactionId, $userId, $paymentDetailId, $pricePlanId, $chargedPrice, $couponId = null, $couponLeftRecurringCount = 0)
    {
        $pricePlanSubscription = new PricePlanSubscription;
        $pricePlanSubscription->transaction_id = $transactionId;
        $pricePlanSubscription->expires_at = new \DateTime("+1 month");
        $pricePlanSubscription->user_id = $userId;
        $pricePlanSubscription->payment_detail_id = $paymentDetailId;
        $pricePlanSubscription->price_plan_id = $pricePlanId;
        $pricePlanSubscription->charged_price = $chargedPrice;
        $pricePlanSubscription->coupon_id = $couponId;
        $pricePlanSubscription->left_coupon_recurring = $couponLeftRecurringCount;
        $pricePlanSubscription->save();
        return $pricePlanSubscription->id;
    }

    private function addTransactionToLog($userId, $pricePlanId, $pricePlanSubscriptionId, $paymentDetailId, $cardNumber, $message, $chargedPrice, $wasSuccessful)
    {
        $autoPaymentLog = new AutoPaymentLog;
        $autoPaymentLog->user_id = $userId;
        $autoPaymentLog->price_plan_id = $pricePlanId;
        $autoPaymentLog->price_plan_subscription_id = $pricePlanSubscriptionId;
        $autoPaymentLog->payment_detail_id = $paymentDetailId;
        $autoPaymentLog->card_number = $cardNumber;
        $autoPaymentLog->transaction_message = $message;
        $autoPaymentLog->charged_price = $chargedPrice;
        $autoPaymentLog->was_successful = $wasSuccessful;
        $autoPaymentLog->save();
    }

    private function subscribeUserToPlan($user, $planId)
    {
        $user->price_plan_id = $planId;
        $user->price_plan_expiry_date = $this->nextExpiryDate;
        $user->save();

        DB::table('users')->where('user_id', $user->id)->update(['price_plan_id' => $planId, 'price_plan_expiry_date' => $this->nextExpiryDate]);
    }

    private function removeAdditionalWebMonitors($user, $maxAllowedWebMonitors)
    {
        $webMonitors = $user->webMonitors()->whereNotNull('uptime_robot_id')->orderBy('name', 'DESC')->get();

        $uptimeRobotService = new UptimeRobotService;
        foreach ($webMonitors as $index => $webMonitor) {
            if ($index >= $maxAllowedWebMonitors) {
                $anyOldMonitor = WebMonitor::where('uptime_robot_id', $webMonitor->uptime_robot_id)->where('id', '<>', $webMonitor->id)->first();
                if (!$anyOldMonitor) {
                    $uptimeRobotService->deleteMonitor($webMonitor->uptime_robot_id);
                }
                $webMonitor->uptime_robot_id = null;
                $webMonitor->save();
            }
        }
    }

    private function disableDataSources($user)
    {
        $user->is_ds_holidays_enabled = false;
        $user->is_ds_google_algorithm_updates_enabled = false;
        $user->is_ds_retail_marketing_enabled = false;
        $user->is_ds_google_alerts_enabled = false;
        $user->is_ds_weather_alerts_enabled = false;
        $user->is_ds_wordpress_updates_enabled = false;
        $user->is_ds_web_monitors_enabled = false;
        $user->save();
    }

    private function disableNotifications($user)
    {
        NotificationSetting::where('user_id', $user->id)->update([
            'is_enabled' => false,
        ]);
    }
}
