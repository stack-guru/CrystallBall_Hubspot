<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\PaymentDetail;
use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use App\Services\BlueSnapService;
use App\Services\SendGridService;
use Auth;
use Carbon\Carbon;
use http\Env\Response;
use Illuminate\Http\Request;

class PaymentController extends Controller
{

    public function indexPaymentHistory()
    {
        if(Auth::user()->user_level !== 'admin') abort(403);

        $pricePlanSubscriptions = PricePlanSubscription::with(['paymentDetail', 'pricePlan'])->orderBy('created_at', 'DESC')->where('user_id', Auth::id())->get();

        return ['price_plan_subscriptions' => $pricePlanSubscriptions];

    }

    public function show(Request $request)
    {

        if (!$request->query('_token')) {
            $blueSnapService = new BlueSnapService;
            $token = $blueSnapService->getToken();

            return redirect()->route('settings.price-plan.payment', ['price_plan_id' => $request->query('price_plan_id'), '_token' => $token]);
        }

        return view('ui/app');
    }

    public function subscribePlan(Request $request)
    {
        $user = Auth::user();
        if($user->user_level !== 'admin') abort(403);

        $this->validate($request, [
            'price_plan_id' => 'required',
        ]);

        $pricePlan = PricePlan::findOrFail($request->price_plan_id);

        $transactionId = 0;
        if ($pricePlan->price != 0) {

            $this->validate($request, [
                'ccLast4Digits' => 'required',
                'expirationMonth' => 'required',
                'expirationYear' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'billing_address' => 'required',
                'city' => 'required',
                'zip_code' => 'nullable',
                'country' => 'required',
                'pfToken' => 'required',
            ]);

            $pricePlanSubscription = new PricePlanSubscription;
            $blueSnapService = new BlueSnapService;
            $sGS = new SendGridService;

            $price = $pricePlan->price;
            if ($request->has('coupon_id') && $request->coupon_id !== null && $request->coupon_id != "null") {
                $coupon = Coupon::find($request->coupon_id);
                if (!$coupon) {
                    return response()->json(['success' => false, 'message' => 'Invalid coupon.'], 422);
                }

                if ($coupon->expires_at <= Carbon::now()) {
                    return response()->json(['success' => false, 'message' => 'Expired coupon used!'], 422);
                }

                $pricePlanSubscription->coupon_id = $coupon->id;
                $price = $price - (($coupon->discount_percent / 100) * $price);
            }
            if (array_search($request->country, ["PK", "IL"]) !== false) {
                $price = $price + ((17 / 100) * $price);
            }

            $price = round($price, 2);

            $obj = $blueSnapService->createTransaction($price, null, null, $request->pfToken);
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
            $paymentDetail->fill($request->all());
            $paymentDetail->card_number = $request->ccLast4Digits;
            $paymentDetail->expiry_month = $request->expirationMonth;
            $paymentDetail->expiry_year = $request->expirationYear;
            $paymentDetail->bluesnap_vaulted_shopper_id = $obj['vaultedShopperId'];
            $paymentDetail->user_id = $user->id;
            $paymentDetail->charged_price = $price;
            $paymentDetail->save();

            $pricePlanSubscription->price_plan_id = $pricePlan->id;
            $pricePlanSubscription->transaction_id = $transactionId;
            $pricePlanSubscription->expires_at = new \DateTime("+1 month");
            $pricePlanSubscription->user_id = $user->id;
            $pricePlanSubscription->payment_detail_id = $paymentDetail->id;
            $pricePlanSubscription->charged_price = $price;
            $pricePlanSubscription->save();

            if ($user->pricePlan->name == "Pro" && $pricePlan->name == "Basic") {
                $sGS->addUserToList($user, "11 GAa Downgraded to Basic");
            }
            $user->price_plan_id = $pricePlan->id;
            $user->price_plan_expiry_date = new \DateTime("+1 month");
            $user->is_billing_enabled = true;
        } else {
            if (($user->pricePlan->name == "Pro" && $pricePlan->name == "Free") || ($user->pricePlan->name == "Basic" && $pricePlan->name == "Free")) {
                $sGS->addUserToList($user, "12 GAa Downgraded to FREE");
            }
            $user->is_billing_enabled = false;
        }
        $user->save();

        switch ($pricePlan->name) {
            case "Basic":
                $sGS->addUserToList($user, "9 GAa Upgraded to Basic");
                break;
            case "Pro":
                $sGS->addUserToList($user, "10 GAa Upgraded to PRO");

                break;
        }

        return ['success' => true, 'transaction_id' => $transactionId];
    }

}
