<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use App\Services\BlueSnapService;
use Auth;
use Carbon\Carbon;
use http\Env\Response;
use Illuminate\Http\Request;
use App\Models\PaymentDetail;

class PaymentController extends Controller
{

    public function indexPaymentHistory()
    {
        $pricePlanSubscriptions = PricePlanSubscription::where('user_id', Auth::id())->get();

        return ['price_plan_subscriptions' => $pricePlanSubscriptions];

    }

    public function subscribePlan(Request $request)
    {

        $this->validate($request, [
            'price_plan_id' => 'required',
        ]);

        $pricePlan = PricePlan::findOrFail($request->price_plan_id);
        $user = Auth::user();

        $transactionId = 0;
        if ($pricePlan->price != 0) {

            $this->validate($request, [
                'cardNumber' => 'required',
                'expirationMonth' => 'required',
                'expirationYear' => 'required',
                'securityCode' => 'nullable',
            ]);

            $card = [
                'cardNumber' => $request->cardNumber,
                'expirationMonth' => $request->expirationMonth,
                'expirationYear' => $request->expirationYear,
                'securityCode' => $request->securityCode,
            ];

            $pricePlanSubscription = new PricePlanSubscription;
            $blueSnapService = new BlueSnapService;

            $price = $pricePlan->price;
            if ($request->has('coupon_id')) {
                $coupon = Coupon::find($request->coupon_id);
                if (!$coupon) {
                    return response()->json(['success' => false, 'message' => 'Invalid coupon.'], 422);
                }

                if ($coupon->expires_at <= Carbon::now()) {
                    return response()->json(['success' => false, 'message' => 'Expired coupon used!'], 422);
                }

                $pricePlanSubscription->coupon_id = $coupon->id;
                $price -= ($coupon->discount_percent / 100) * $price;
            }
            $obj = $blueSnapService->createTransaction($price, $card);
            if ($obj['success'] == false) {
                return response()->json(['success' => false, 'message' => $obj['message']], 422);
            }
            if (isset($coupon)) {
                $coupon->usage_count += 1;
                $coupon->save();
            }

            $transactionId = $obj['transactionId'];

            $verification = $blueSnapService->getTransaction($pricePlan, $transactionId);
            if ($verification['success'] == false) {
                return response()->json(['success' => false, 'message' => $verification['message']], 422);
            }

            $paymentDetail = new PaymentDetail;
            $paymentDetail->cardholder_name = $request->cardholderName;
            $paymentDetail->card_number = $request->cardNumber;
            $paymentDetail->expiry_month = $request->expirtationMonth;
            $paymentDetail->expiry_year = $request->expirationYear;
            
            $paymentDetail->full_name = $request->full_name;
            $paymentDetail->billing_address = $request->billing_address;
            $paymentDetail->city = $request->city;
            $paymentDetail->zip_code = $request->zip_code;
            $paymentDetail->country = $request->country;
            $paymentDetail->save();

            $pricePlanSubscription->price_plan_id = $pricePlan->id;
            $pricePlanSubscription->transaction_id = $transactionId;
            $pricePlanSubscription->expires_at = new \DateTime("+1 month");
            $pricePlanSubscription->user_id = $user->id;
            $pricePlanSubscription->save();

        }

        $user->price_plan_id = $pricePlan->id;
        $user->price_plan_expiry_date = new \DateTime("+1 month");
        $user->save();

        return ['success' => true, 'transaction_id' => $transactionId];
    }

}
