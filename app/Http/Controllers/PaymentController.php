<?php

namespace App\Http\Controllers;

use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use Bluesnap;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{

    public function subscribePlan(Request $request)
    {

        $this->validate($request, [
            'price_plan_id'=>'required',
        ]);

        $pricePlan = PricePlan::findOrFail($request->price_plan_id);

        $transactionId = 0;
        if ($pricePlan->price != 0) {

            $this->validate($request, [
                'cardNumber' => 'required',
                'expirationMonth' => 'required',
                'expirationYear' => 'required',
                'securityCode' => 'required',
            ]);



            $card = [
                'cardNumber' => $request->cardNumber,
                'expirationMonth' => $request->expirationMonth,
                'expirationYear' => $request->expirationYear,
                'securityCode' => $request->securityCode,
            ];
            $obj = $this->createTransaction($pricePlan, $card);
            if ($obj['success'] == false) {
                return response()->json(['success' => false, 'error' => $obj['error']], 422);
            }
          $transactionId=$obj['transactionId'];

        $verification = $this->getTransaction($pricePlan, $transactionId);
            if ($verification['success'] == false) {
                return response()->json(['success' => false, 'error' => $verification['error']], 422);
            }
        $pricePlanSubscription = new PricePlanSubscription;
                    if ($request->has('coupon_id')) {
                        $pricePlanSubscription->coupon_id = $request->query('coupon_id');
                    }
                    $pricePlanSubscription->price_plan_id = $pricePlan->id;
                    $pricePlanSubscription->transaction_id = $transactionId;
                    $pricePlanSubscription->expires_at = new \DateTime("+1 month");
                    $pricePlanSubscription->user_id = Auth::id();
                    $pricePlanSubscription->save();
        }


        $user = Auth::user();
                $user->price_plan_id = $pricePlan->id;
                $user->price_plan_expiry_date = new \DateTime("+1 month");
                $user->update();


        return ['success' => true, 'transaction_id' => $transactionId];
    }


    /**
     * Get a Transaction
     *
     * @param int $transaction_id
     * @return \tdanielcox\Bluesnap\Models\CardTransaction
     */
    public function getTransaction($pricePlan, $transaction_id)
    {
        Bluesnap\Bluesnap::init(config('services.bluesnap.environment'), config('services.bluesnap.api.key'), config('services.bluesnap.api.password'));
        $response = Bluesnap\CardTransaction::get($transaction_id);

        if ($response->failed()) {
            $error = $response->data;

            return ['success' => false, 'error' => $error];
        }

        $transaction = $response->data;

        return ['success' => true];
    }

    /**
     * Authorize a New Transaction (with vendor, vaultedShopper, saved card)
     *
     * @param int $vaulted_shopper_id
     * @param int $vendor_id
     * @return \tdanielcox\Bluesnap\Models\CardTransaction
     */
    public function authorizeTransaction($vaulted_shopper_id, $vendor_id)
    {
        $response = \tdanielcox\Bluesnap\CardTransaction::create([
            'vendorInfo' => [
                'vendorId' => $vendor_id,
                'commissionAmount' => 4.00,
            ],
            'vaultedShopperId' => $vaulted_shopper_id,
            'creditCard' => [
                'cardLastFourDigits' => '1111',
                'securityCode' => '111',
                'cardType' => 'VISA',
            ],
            'amount' => 10.00,
            'currency' => 'USD',
            'recurringTransaction' => 'ECOMMERCE',
            'cardTransactionType' => 'AUTH_ONLY',
            'softDescriptor' => 'Your description',
        ]);

        if ($response->failed()) {
            $error = $response->data;

            // handle error
        }

        $transaction = $response->data;

        return $transaction;
    }
/**
 * Create a New Transaction (simple)
 *
 * @return \tdanielcox\Bluesnap\Models\CardTransaction
 */
    public function createTransaction($pricePlan, $card)
    {
        Bluesnap\Bluesnap::init(config('services.bluesnap.environment'), config('services.bluesnap.api.key'), config('services.bluesnap.api.password'));

        $response = Bluesnap\CardTransaction::create([
            'creditCard' => [
                'cardNumber' => $card['cardNumber'],
                'expirationMonth' => $card['expirationMonth'],
                'expirationYear' => $card['expirationYear'],
                'securityCode' => $card['securityCode'],
            ],
            'amount' => $pricePlan->price,
            'currency' => 'USD',
            'recurringTransaction' => 'ECOMMERCE',
            'cardTransactionType' => 'AUTH_CAPTURE',
        ]);

        // Bluesnap\Response {#1325 ▼
        //     -_status: "error"
        //     +data: "The stated credit card expiration date has already passed."
        // }

        if ($response->failed()) {
            $error = $response->data;
            return ['success' => false, 'error' => $error];
        }

        $transaction = $response->data;

        return ['success' => true, 'transactionId' => $transaction->id];
    }

}
