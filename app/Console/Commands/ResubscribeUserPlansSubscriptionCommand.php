<?php

namespace App\Console\Commands;

use App\Mail\AdminFailedPaymentTransactionMail;
use App\Mail\UserFailedPaymentTransactionMail;
use App\Models\AutoPaymentLog;
use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use App\Models\User;
use App\Services\BlueSnapService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\Admin;

class ResubscribeUserPlansSubscriptionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:resubscribe-user-plans';

    private $freePlanId;
    private $nextExpiryDate;
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
        }
        $admin = Admin::first();
        if ($admin) {
            $this->admin = $admin;
        }
        $this->nextExpiryDate = new \DateTime("+1 month");

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
            ->with('pricePlan')
            ->with('lastPaymentDetail')
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->where('price_plans.price', '<>', 0)
            ->get();

        $blueSnapService = new BlueSnapService;
        foreach ($users as $user) {
            $lastPaymentDetail = $user->lastPaymentDetail;

            if ($lastPaymentDetail && $user->is_billing_enabled) {
                $card = [
                    'cardNumber' => $lastPaymentDetail->cardNumber,
                    'expirationMonth' => $lastPaymentDetail->expirationMonth,
                    'expirationYear' => $lastPaymentDetail->expirationYear,
                    'securityCode' => $lastPaymentDetail->securityCode,
                ];
                $responseArr = $blueSnapService->createTransaction($user->pricePlan->price, $card, $lastPaymentDetail->bluesnap_vaulted_shopper_id);
                if ($responseArr['success'] == false) {
                    $this->addTransactionToLog($user->id, $user->price_plan_id, null, $lastPaymentDetail->id, $lastPaymentDetail->card_number, $responseArr['message'], $user->pricePlan->price, false);
                    $this->subscribeUserToPlan($user, $this->freePlanId);
                    Mail::to($this->admin)->send(new AdminFailedPaymentTransactionMail($lastPaymentDetail, $this->admin));
                    Mail::to($user)->send(new UserFailedPaymentTransactionMail($lastPaymentDetail));
                } else {
                    $pricePlanSubscriptionId = $this->addPricePlanSubscription($responseArr['transactionId'], $user->id, $lastPaymentDetail->id, $user->price_plan_id, $user->pricePlan->price);
                    $this->addTransactionToLog($user->id, $user->price_plan_id, $pricePlanSubscriptionId, $lastPaymentDetail->id, $lastPaymentDetail->card_number, null, $user->pricePlan->price, true);
                    $this->subscribeUserToPlan($user, $user->price_plan_id);
                }
            } else {
                $this->subscribeUserToPlan($user, $this->freePlanId);
            }
        }
        // update([
        //     'users.price_plan_expiry_date' => new \DateTime("+1 month"),
        // ]);

        print count($users) . " Users have been resubscribed to their paid plans.\n";
    }

    private function resubscribeFreePlanUsers()
    {
        $updateCount = User::where('price_plan_expiry_date', '<', new \DateTime)
            ->join('price_plans', 'users.price_plan_id', 'price_plans.id')
            ->where('price_plans.price', 0)
            ->update([
                'users.price_plan_expiry_date' => $this->nextExpiryDate,
            ]);

        print "$updateCount Users have been resubscribed to their free plans.\n";
    }

    private function addPricePlanSubscription($transactionId, $userId, $paymentDetailId, $pricePlanId, $chargedPrice)
    {
        $pricePlanSubscription = new PricePlanSubscription;
        $pricePlanSubscription->transaction_id = $transactionId;
        $pricePlanSubscription->expires_at = new \DateTime("+1 month");
        $pricePlanSubscription->user_id = $userId;
        $pricePlanSubscription->payment_detail_id = $paymentDetailId;
        $pricePlanSubscription->price_plan_id = $pricePlanId;
        $pricePlanSubscription->charged_price = $chargedPrice;
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
    }
}
