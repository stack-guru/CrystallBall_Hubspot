<?php

namespace App\Http\Controllers;

use App\Mail\AdminPlanUpgradedMail;
use App\Models\Admin;
use App\Models\Coupon;
use App\Models\PaymentDetail;
use App\Models\PricePlan;
use App\Models\WebMonitor;
use App\Models\PricePlanSubscription;
use App\Services\BlueSnapService;
use App\Services\SendGridService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{

    public function indexPaymentHistory()
    {
        if (Auth::user()->user_id) {
            abort(403, 'Only account owner is allowed to view payment history.');
        }

        $pricePlanSubscriptions = PricePlanSubscription::with(['paymentDetail', 'pricePlan'])->orderBy('created_at', 'DESC')->where('user_id', Auth::id())->get();

        return ['price_plan_subscriptions' => $pricePlanSubscriptions];
    }

    public function show(Request $request)
    {

        $user = Auth::user();
        if ($user->user_id) {
            abort(403, "Only account owner is allowed to subscribe price plans.");
        }

        if (!$request->query('_token')) {
            $this->validate($request, [
                'price_plan_id' => 'required|exists:price_plans,id',
                'plan_duration' => 'required|in:1,12',
            ]);

            $blueSnapService = new BlueSnapService;
            $token = $blueSnapService->getToken();

            return redirect()->route('settings.price-plan.payment', [
                'price_plan_id' => $request->query('price_plan_id'),
                'plan_duration' => $request->query('plan_duration'),
                '_token' => $token
            ]);
        }

        return view('ui/app');
    }

    public function subscribePlan(Request $request)
    {
        $user = Auth::user();
        if ($user->user_id) {
            abort(403, "Only account owner is allowed to subscribe price plans.");
        }

        $this->validate($request, [
            'price_plan_id' => 'required|exists:price_plans,id',
            'plan_duration' => 'required|in:1,12',
        ]);

        // Putting values in variable for use
        $pricePlan = PricePlan::findOrFail($request->price_plan_id);
        $pricePlanExipryDuration = "+" . $request->plan_duration . " month";
        $pricePlanExpiryDate = new \DateTime($pricePlanExipryDuration);

        $transactionId = 0;
        $sGS = new SendGridService;
        if ($pricePlan->price == 0) {
            if (($user->pricePlan->name == PricePlan::PRO && $pricePlan->name == PricePlan::FREE) || ($user->pricePlan->name == PricePlan::BASIC && $pricePlan->name == PricePlan::FREE)) {
                // User is downgrading to $0 plan
                $sGS->addUserToMarketingList($user, "12 GAa Downgraded to FREE");
                WebMonitor::removeAdditionalWebMonitors($user, $pricePlan->web_monitor_count);
            }
            $user->is_billing_enabled = false;
        } else {
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

            // Basic monthly price
            $price = $pricePlan->price;

            // Applying annual discount if applicable
            if ($request->plan_duration == PricePlan::ANNUALLY) {
                if ($pricePlan->yearly_discount_percent > 0) {
                    // price = 12*price - discount*12
                    $price = ($pricePlan->price * 12) - (round((float)(($pricePlan->price * 12) * ($pricePlan->yearly_discount_percent / 100)), 2));
                }
            }

            // Coupon Code
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
                $pricePlanSubscription->left_coupon_recurring = $coupon->recurring_discount_count;
            }

            // General Sales Tax
            if (array_search($request->country, ["IL"]) !== false) {
                $price = $price + ((17 / 100) * $price);
            }
            $price = round($price, 2);

            // Attempting BlueSnap transaction
            $obj = $blueSnapService->createTransaction($price, null, null, $request->pfToken);
            if ($obj['success'] == false) {
                return response()->json(['success' => false, 'message' => $obj['message']], 422);
            }

            // Tracking coupon usage
            if (isset($coupon)) {
                $coupon->usage_count += 1;
                $coupon->save();
            }

            // Verifying transaction status from bluesnap
            $transactionId = $obj['transactionId'];
            $verification = $blueSnapService->getTransaction($pricePlan, $transactionId);
            if ($verification['success'] == false) {
                return response()->json(['success' => false, 'message' => $verification['message']], 422);
            }

            // Saving payment details to database
            $paymentDetail = new PaymentDetail;
            $paymentDetail->fill($request->all());
            $paymentDetail->card_number = $request->ccLast4Digits;
            $paymentDetail->expiry_month = $request->expirationMonth;
            $paymentDetail->expiry_year = $request->expirationYear;
            $paymentDetail->bluesnap_vaulted_shopper_id = $obj['vaultedShopperId'];
            $paymentDetail->user_id = $user->id;
            $paymentDetail->charged_price = $price;
            $paymentDetail->save();

            // Recording transaction subscription to database
            $pricePlanSubscription->plan_duration = $request->plan_duration;
            $pricePlanSubscription->price_plan_id = $pricePlan->id;
            $pricePlanSubscription->transaction_id = $transactionId;
            $pricePlanSubscription->expires_at = $pricePlanExpiryDate;
            $pricePlanSubscription->user_id = $user->id;
            $pricePlanSubscription->payment_detail_id = $paymentDetail->id;
            $pricePlanSubscription->charged_price = $price;
            $pricePlanSubscription->save();

            // Sending email to user if downgraded
            if ($user->pricePlan->name == PricePlan::PRO && $pricePlan->name == PricePlan::BASIC) {
                // User is downgrading to basic plan from pro plan
                $sGS->addUserToMarketingList($user, "11 GAa Downgraded to Basic");
                WebMonitor::removeAdditionalWebMonitors($user, $pricePlan->web_monitor_count);
            }

            // Reflecting price plan purhcase to user's account
            $user->price_plan_id = $pricePlan->id;
            $user->price_plan_expiry_date = $pricePlanExpiryDate;
            $user->is_billing_enabled = true;
        }
        $user->save();
        // Reflecting price plan purhcase to user's team accounts
        DB::table('users')->where('user_id', $user->id)->update(['price_plan_id' => $pricePlan->id, 'price_plan_expiry_date' => $pricePlanExpiryDate]);
        $user->refresh();

        // Sending email to user if upgraded
        switch ($pricePlan->name) {
            case PricePlan::INDIVIDUAL:
                $sGS->addUserToMarketingList($user, "Upgraded to Individual");
                break;
            case PricePlan::BASIC:
                $sGS->addUserToMarketingList($user, "9 GAa Upgraded to Basic");
                break;
            case PricePlan::PRO:
                $sGS->addUserToMarketingList($user, "10 GAa Upgraded to PRO");
                break;
        }

        // Enabling user's web monitors accoridng to new limits.
        WebMonitor::addAllowedWebMonitors($user, $pricePlan->web_monitor_count);

        // A notification to system administrator of the purchase
        $admin = Admin::first();
        Mail::to($admin)->send(new AdminPlanUpgradedMail($admin, $user));

        return ['success' => true, 'transaction_id' => $transactionId];
    }
}
