<?php

namespace App\Console\Commands;

use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use App\Models\User;
use App\Services\BlueSnapService;
use Illuminate\Console\Command;

class ResubscribeUserPlansSubscriptionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:resubscribe-user-plans';

    private $freePlanId;
    private $nextExpiryDate;
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
        $freePlan = PricePlan::where('price', 0)->first();
        if ($freePlan) {
            $this->freePlanId = $freePlan->id;
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
                $responseArr = $blueSnapService->createTransaction($lastPaymentDetail->charged_price, $card, $lastPaymentDetail->bluesnap_vaulted_shopper_id);
                if ($responseArr['success'] == false) {
                    print $responseArr['message'] . "\n";
                    print "Payment transaction failed. Downgrading to free plan.\n";
                    exit;
                    $user->price_plan_id = $this->freePlanId;
                    $user->price_plan_expiry_date = $this->nextExpiryDate;
                    $user->save();
                } else {
                    $pricePlanSubscription = new PricePlanSubscription;
                    $pricePlanSubscription->transaction_id = $responseArr['transactionId'];
                    $pricePlanSubscription->expires_at = new \DateTime("+1 month");
                    $pricePlanSubscription->user_id = $user->id;
                    $pricePlanSubscription->payment_detail_id = $lastPaymentDetail->id;
                    $pricePlanSubscription->save();
                    $user->price_plan_expiry_date = $this->nextExpiryDate;
                    $user->save();
                }
            } else {
                print "Unable to find payment details.\n";
                $user->price_plan_id = $this->freePlanId;
                $user->price_plan_expiry_date = $this->nextExpiryDate;
                $user->save();
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
}
