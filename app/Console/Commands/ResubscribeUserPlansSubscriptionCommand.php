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
use App\Models\UserDataSource;
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

    private $downgradePricePlan;
    private $downgradePricePlanId;
    private $nextExpiryDate;
    private $currentDate;
    private $admin;
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gather all expired plans and try to resubscribe them. It will also renew free plans.';

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
        $downgradePricePlan = PricePlan::where('price', 0)->where('code', PricePlan::CODE_FREE_NEW)->first();
        if ($downgradePricePlan) {
            $this->downgradePricePlanId = $downgradePricePlan->id;
            $this->downgradePricePlan = $downgradePricePlan;
        }
        $admin = Admin::first();
        if ($admin) {
            $this->admin = $admin;
        }
        $this->nextExpiryDate = new \DateTime("+1 month");
        $this->currentDate = new \DateTime();

        // Order matters don't interchange lines
        $this->downgradeTrialUsers();
        $this->resubscribeFreePlanUsers();
        $this->resubscribePaidPlanUsers();

        // ->update([
        //     'price_plan_id' => PricePlan::where('price', 0.00)->where('is_enabled', true)->first()->id,
        //     'price_plan_expiry_date' => new \DateTime("+1 month")
        // ]);
        //return count($users);
    }

    private function  downgradeTrialUsers()
    {
        // Trial user(s) moving to free plan
        $trialUsers = User::select('users.*')
            ->where('price_plan_expiry_date', '<', new \DateTime)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->where('price_plans.price', 0)
            ->where('price_plans.name', PricePlan::TRIAL)
            ->get();
        $this->comment(count($trialUsers) . " user(s) are currently on " . PricePlan::TRIAL . " plan and will be downgraded.");

        foreach ($trialUsers as $trialUser) {
            $trialUser->price_plan_expiry_date = $this->nextExpiryDate;
            $trialUser->price_plan_id = $this->downgradePricePlanId;

            WebMonitor::removeAdditionalWebMonitors($trialUser, $this->downgradePricePlan->web_monitor_count);
            UserDataSource::disableDataSources($trialUser);
            NotificationSetting::disableNotifications($trialUser);

            $trialUser->trial_ended_at = $this->currentDate;

            $trialUser->save();

            event(new UserTrialPricePlanEnded($trialUser));
        }
        // dd($this->downgradePricePlan);
        $this->info(count($trialUsers) . " user(s) have been subscribed from " . PricePlan::TRIAL . " plan to " . $this->downgradePricePlan->name . " plan.");
    }

    private function resubscribeFreePlanUsers()
    {

        // Free plan user(s) resubscribing to free plan with new expiry dates
        // There are multiple free plans in the system that's why the query
        // below, does not change price_plan_id,  it only extends price_plan_expiry_date
        $updateCount = User::where('price_plan_expiry_date', '<', new \DateTime)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->where('price_plans.price', 0)
            ->update([
                'users.price_plan_expiry_date' => $this->nextExpiryDate,
                'users.is_ds_holidays_enabled' => false,
                'users.is_ds_google_algorithm_updates_enabled' => false,
                'users.is_ds_retail_marketing_enabled' => false,
                'users.is_ds_google_alerts_enabled' => false,
                'users.is_ds_weather_alerts_enabled' => false,
                'users.is_ds_wordpress_updates_enabled' => false,
                'users.is_ds_web_monitors_enabled' => false,
            ]);

        $this->info("$updateCount user(s) have been resubscribed to their free plans.");
    }

    // There are multiple paid plans in the system that's why the query
    // below, does not change price_plan_id,  it only extends price_plan_expiry_date
    // after attempting payment deduction and downgrades to trial ended
    // plan if the payment fails
    private function resubscribePaidPlanUsers()
    {

        $users = User::select('users.*')->where('price_plan_expiry_date', '<', new \DateTime)
            ->where('price_plans.price', '<>', 0)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->with('pricePlan')
            ->with('lastPaymentDetail')
            ->with('lastPricePlanSubscription.userRegistrationOffer')
            ->get();
        $this->comment(count($users) . " user(s) are currently on paid plans and will be charged.");

        $blueSnapService = new BlueSnapService;
        foreach ($users as $user) {
            $lastPaymentDetail = $user->lastPaymentDetail;
            $lastPricePlanSubscription = $user->lastPricePlanSubscription;
            $pricePlan = $user->pricePlan;

            if ($lastPaymentDetail && $user->is_billing_enabled) {
                $card = [
                    'cardNumber' => $lastPaymentDetail->cardNumber,
                    'expirationMonth' => $lastPaymentDetail->expiry_month,
                    'expirationYear' => $lastPaymentDetail->expiry_year,
                    'securityCode' => $lastPaymentDetail->security_code,
                ];
                // Basic monthly price
                $pricePlanPrice = $pricePlan->price;

                // Applying annual discount if applicable
                if ($lastPricePlanSubscription->plan_duration == PricePlan::ANNUALLY) {
                    if ($pricePlan->yearly_discount_percent > 0) {
                        // price = 12*price - discount*12
                        $pricePlanPrice = ($pricePlan->price * 12) - (round((float)($pricePlan->price * ($pricePlan->yearly_discount_percent / 100)), 0) * 12);
                    }
                }

                $discountPercentSum = 0.00;
                // Coupon Code
                $isCouponApplied = $isRegistrationOfferApplied = false;
                if ($lastPricePlanSubscription->coupon && $lastPricePlanSubscription->left_coupon_recurring > 0) {
                    $isCouponApplied = true;
                    $coupon = $lastPricePlanSubscription->coupon;
                    $discountPercentSum += $coupon->discount_percent;
                }

                //Registration Offer
                if ($lastPricePlanSubscription->userRegistrationOffer && $lastPricePlanSubscription->left_registration_offer_recurring > 0) {
                    $isRegistrationOfferApplied = true;
                    $discountPercentSum += $lastPricePlanSubscription->userRegistrationOffer->discount_percent;
                }

                $pricePlanPrice = $pricePlanPrice - (($discountPercentSum / 100) * $pricePlanPrice);

                // General Sales Tax
                if (array_search($lastPaymentDetail->country, ["IL"]) !== false) {
                    $pricePlanPrice = $pricePlanPrice + ((17 / 100) * $pricePlanPrice);
                }

                $pricePlanPrice = round($pricePlanPrice, 2);
                $responseArr = $blueSnapService->createTransaction($pricePlanPrice, $card, $lastPaymentDetail->bluesnap_vaulted_shopper_id);
                if ($responseArr['success'] == false) {
                    // Downgrading user to free plan
                    $this->addTransactionToLog($user->id, $user->price_plan_id, null, $lastPaymentDetail->id, $lastPaymentDetail->card_number, $responseArr['message'], $pricePlanPrice, false);
                    $this->subscribeUserToPlan($user, $this->downgradePricePlanId, $this->nextExpiryDate);
                    WebMonitor::removeAdditionalWebMonitors($user, $this->downgradePricePlan->web_monitor_count);
                    UserDataSource::disableDataSources($user);
                    NotificationSetting::disableNotifications($user);
                    Mail::to($this->admin)->send(new AdminFailedPaymentTransactionMail($lastPaymentDetail, $this->admin));
                    Mail::to($user)->send(new UserFailedPaymentTransactionMail($lastPaymentDetail));
                } else {
                    // Continuing user paid plan
                    // checking if recurring coupon applied
                    if ($isCouponApplied) {
                        $pricePlanSubscriptionId = $this->addPricePlanSubscription($responseArr['transactionId'], $user->id, $lastPaymentDetail->id, $user->price_plan_id, $pricePlanPrice, new \DateTime('+' . $lastPricePlanSubscription->plan_duration . ' month'), $coupon->id, $coupon->recurring_discount_count - 1);
                    } else {
                        $pricePlanSubscriptionId = $this->addPricePlanSubscription($responseArr['transactionId'], $user->id, $lastPaymentDetail->id, $user->price_plan_id, $pricePlanPrice, new \DateTime('+' . $lastPricePlanSubscription->plan_duration . ' month'));
                    }

                    // checking if registration offer is applied
                    if ($isRegistrationOfferApplied) {
                        $pricePlanSubscription = PricePlanSubscription::find($pricePlanSubscriptionId);
                        $pricePlanSubscription->left_registration_offer_recurring = $lastPricePlanSubscription->left_registration_offer_recurring - 1;
                        // Backend is capable of saving only 1 registration offer
                        // while the frontend supports multiple registration offers calculations
                        $pricePlanSubscription->user_registration_offer_id = $lastPricePlanSubscription->userRegistrationOffer->id;
                        $pricePlanSubscription->save();
                    }
                    $this->addTransactionToLog($user->id, $user->price_plan_id, $pricePlanSubscriptionId, $lastPaymentDetail->id, $lastPaymentDetail->card_number, null, $pricePlanPrice, true);
                    $this->subscribeUserToPlan($user, $user->price_plan_id,  new \DateTime('+' . $lastPricePlanSubscription->plan_duration . ' month'));
                }
            } else {
                // Downgrading user to free plan
                if (!$user->user_id) {
                    $this->subscribeUserToPlan($user, $this->downgradePricePlanId, $this->nextExpiryDate);
                    WebMonitor::removeAdditionalWebMonitors($user, $this->downgradePricePlan->web_monitor_count);
                    UserDataSource::disableDataSources($user);
                    NotificationSetting::disableNotifications($user);
                }
            }
        }
        // update([
        //     'users.price_plan_expiry_date' => new \DateTime("+1 month"),
        // ]);

        $this->info(count($users) . " user(s) have been resubscribed to their paid plans.");
    }

    private function addPricePlanSubscription($transactionId, $userId, $paymentDetailId, $pricePlanId, $chargedPrice, $expiryDate, $couponId = null, $couponLeftRecurringCount = 0)
    {
        $pricePlanSubscription = new PricePlanSubscription;
        $pricePlanSubscription->transaction_id = $transactionId;
        $pricePlanSubscription->expires_at = $expiryDate;
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

    private function subscribeUserToPlan($user, $planId, $nextExpiryDate)
    {
        $user->price_plan_id = $planId;
        $user->price_plan_expiry_date = $nextExpiryDate;
        $user->save();

        DB::table('users')->where('user_id', $user->id)->update(['price_plan_id' => $planId, 'price_plan_expiry_date' => $nextExpiryDate]);
    }
}
