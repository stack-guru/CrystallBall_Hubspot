<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AutoPaymentLog;
use App\Models\PaymentDetail;
use App\Models\PricePlanSubscription;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\BlueSnapService;

class DeductPaymentController extends Controller
{
    public function create(Request $request)
    {
        $userId = $request->query('user_id');
        $paymentDetailId = $request->query('payment_detail_id');
        $amount = $request->query('amount');

        $user = User::findOrFail($userId);
        $paymentDetails = PaymentDetail::where('user_id', $user->id)->orderBy('created_at', 'DESC')->get();

        return view('admin/deduct-payment/create')->with('paymentDetails', $paymentDetails)
            ->with('amount', $amount)
            ->with('user', $user)
            ->with('paymentDetailId', $paymentDetailId);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'user_id' => 'required|numeric|exists:users,id',
            'payment_detail_id' => 'required|numeric|exists:payment_details,id',
            'amount' => 'required|numeric'
        ]);

        $user = User::findOrFail($request->user_id);
        $paymentDetail = PaymentDetail::findOrFail($request->payment_detail_id);
        $amount = $request->amount;

        $card = [
            'cardNumber' => $paymentDetail->cardNumber,
            'expirationMonth' => $paymentDetail->expiry_month,
            'expirationYear' => $paymentDetail->expiry_year,
            'securityCode' => $paymentDetail->security_code,
        ];

        $blueSnapService = new BlueSnapService;

        $amount = round($amount, 2);
        $responseArr = $blueSnapService->createTransaction($amount, $card, $paymentDetail->bluesnap_vaulted_shopper_id);

        $pricePlanSubscriptionId = $this->addPricePlanSubscription($responseArr['transactionId'], $user->id, $paymentDetail->id, $user->price_plan_id, $amount);
        $this->addTransactionToLog($user->id, $user->price_plan_id, $pricePlanSubscriptionId, $paymentDetail->id, $paymentDetail->card_number, null, $amount, true);


        return redirect()->route('admin.auto-payment-log.index')->with('success', $responseArr['success']);
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
}
