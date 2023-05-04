<?php

namespace App\Http\Controllers;

use App\Helpers\CheckUserUsageHelper;
use App\Helpers\DowngradedUserHelper;
use App\Helpers\UpgradedUserHelper;
use App\Jobs\MarkSalesInFirstPromoter;
use App\Mail\AdminFailedAttemptMail;
use App\Mail\AdminPlanDowngradedMail;
use App\Mail\AdminPlanUpgradedMail;
use App\Models\Admin;
use App\Models\Coupon;
use App\Models\GoogleAnalyticsProperty;
use App\Models\NotificationSetting;
use App\Models\PaymentDetail;
use App\Models\PlanNotification;
use App\Models\PricePlan;
use App\Models\WebMonitor;
use App\Models\PricePlanSubscription;
use App\Models\User;
use App\Models\UserRegistrationOffer;
use App\Services\BlueSnapService;
use App\Services\SendGridService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{

    private const taxableCountries = ['IL'];

    public function indexPaymentHistory()
    {
        if (Auth::user()->user_id) {
            abort(403, 'Only account owner is allowed to view payment history.');
        }

        $pricePlanSubscriptions = PricePlanSubscription::with(['paymentDetail', 'pricePlan'])->orderBy('created_at', 'DESC')->ofCurrentUser()->get();

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

        // Checking if price plan is disabled from purchase
        if (!$pricePlan->is_enabled) {
            return response()->json(['success' => false, 'message' => 'Selected price plan is not available for purchase.'], 422);
        }

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

                'company_name' => 'nullable|string',
                'company_registration_number' => 'nullable|string',
                'phone_number_prefix' => 'nullable|string',
                'phone_number' => 'nullable|string',

                'first_name' => 'required',
                'last_name' => 'required',
                'billing_address' => 'required',
                'city' => 'required',
                'zip_code' => 'required',
                'country' => 'required',
                'pfToken' => 'required',
            ]);

            $pricePlanSubscription = new PricePlanSubscription;
            $blueSnapService = new BlueSnapService;

            // Basic monthly price
            $price = $pricePlan->price * $request->plan_duration;
            $discountPercentSum = 0.00;

            // Registration Offers
            $userRegistrationOffers = UserRegistrationOffer::ofCurrentUser()->alive()->get();
            if (count($userRegistrationOffers)) {
                foreach ($userRegistrationOffers as $userRegistrationOffer) {
                    // Backend is capable of saving only 1 registration offer with price plan subscription details
                    // while the frontend supports multiple registration offer's calculations
                    $pricePlanSubscription->user_registration_offer_id = $userRegistrationOffer->id;
                    $discountPercentSum += $userRegistrationOffer->discount_percent;
                    if ($request->plan_duration == PricePlan::ANNUALLY) {
                        $pricePlanSubscription->left_registration_offer_recurring = $userRegistrationOffer->yearly_recurring_discount_count;
                    } else {
                        $pricePlanSubscription->left_registration_offer_recurring = $userRegistrationOffer->monthly_recurring_discount_count;
                    }
                }
            } else {
                // Applying annual discount if applicable
                if ($request->plan_duration == PricePlan::ANNUALLY) {
                    if ($pricePlan->yearly_discount_percent > 0) {
                        $discountPercentSum += $pricePlan->yearly_discount_percent;
                    }
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
                $discountPercentSum += $coupon->discount_percent;
                $pricePlanSubscription->left_coupon_recurring = $coupon->recurring_discount_count;
            }

            $price = $price - (($price) * ($discountPercentSum / 100));

            // General Sales Tax
            if (array_search($request->country, $this::taxableCountries) !== false) {
                $price = $price + ((17 / 100) * $price);
            }
            $price = round($price, 2, PHP_ROUND_HALF_DOWN);

            // Create this user in BlueSnap as Vaulted Shopper
            $vaultedShopper = $blueSnapService->createVaultedShopper([
                'email' => $user->email,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'country' => $request->country,
                'city' => $request->city,
                'billing_address' => $request->billing_address,
                'zip_code' => $request->zip_code,
            ]);

            // Attempting BlueSnap transaction
            $obj = $blueSnapService->createTransaction($price, null, $vaultedShopper['vaultedShopperId'], $request->pfToken);
            if ($obj['success'] == false) {
                $planNotification = new PlanNotification();
                $planNotification->user_id = $user->id;
                $planNotification->type = 'Failed Attempts To Bill For '.$user->name;
                $planNotification->text = $obj['message'];
                $planNotification->save();
                $admin = Admin::first();
                Mail::to($admin)->cc('ron@crystalballinsight.com')->send(new AdminFailedAttemptMail($admin, $user,$obj['message']));
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
                $planNotification = new PlanNotification();
                $planNotification->user_id = $user->id;
                $planNotification->type = 'Failed Attempts To Bill For '.$user->name;
                $planNotification->text = $verification['message'];
                $planNotification->save();
                $admin = Admin::first();
                Mail::to($admin)->cc('ron@crystalballinsight.com')->send(new AdminFailedAttemptMail($admin, $user,$verification['message']));
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
            // if ($user->pricePlan->name == PricePlan::PRO && $pricePlan->name == PricePlan::BASIC) {
            //     // User is downgrading to basic plan from pro plan
            //     $sGS->addUserToMarketingList($user, "11 GAa Downgraded to Basic");
            //     WebMonitor::removeAdditionalWebMonitors($user, $pricePlan->web_monitor_count);
            // }
            DowngradedUserHelper::downgradingUser($user,$pricePlan);
            // Reflecting price plan purhcase to user's account
            $user->price_plan_id = $pricePlan->id;
            $user->price_plan_expiry_date = $pricePlanExpiryDate;
            $user->is_billing_enabled = true;
        }
        $user->save();
        UpgradedUserHelper::UpgradingUser($user,$pricePlan);
        // A notification to system administrator of the purchase
        $admin = Admin::first();
        $notification = new PlanNotification();
        $notification->user_id = $user->id;
        if($pricePlan->price > $user->pricePlan->price)
        {
            $notification->type = 'Package Upgraded';
            $notification->text = $user->name.' package upgraded to '.$pricePlan->name;
            $notification->save();
            Mail::to($admin)->cc('ron@crystalballinsight.com')->send(new AdminPlanUpgradedMail($admin, $user));
        }else{ 
            $notification->type = 'Package Downgraded';
            $notification->text = $user->name.' package downgraded to '.$pricePlan->name;
            $notification->save();
            Mail::to($admin)->cc('ron@crystalballinsight.com')->send(new AdminPlanDowngradedMail($admin, $user));    
        } 
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
        if ($pricePlan->price) dispatch(new MarkSalesInFirstPromoter($user, $pricePlan, $price, $transactionId));

        return ['success' => true, 'transaction_id' => $transactionId];
    }
    public function checkExtraApps(Request $request)
    {
        $user = Auth::user();
        $showAlerts = [];
        $alertText = [];
        $this->validate($request, [
            'price_plan_id' => 'required|exists:price_plans,id'
        ]);
        $pricePlan = PricePlan::findOrFail($request->price_plan_id);

        //Alert for google analytics Property Start
        $propertyCount = GoogleAnalyticsProperty::where('user_id',$user->id)->where('is_in_use',1)->count();
        if($pricePlan->google_analytics_property_count != 0 && $propertyCount > 0 && $pricePlan->google_analytics_property_count < $propertyCount)
        {
            if($pricePlan->google_analytics_property_count == -1 || $pricePlan->google_analytics_property_count == null)
                $properties_limit_of_selected_plan = 0;
            else 
                $properties_limit_of_selected_plan = $pricePlan->google_analytics_property_count;
            $text = "During the ".$user->pricePlan->name." you used ". $propertyCount ." properties and the plan you selected allows only ".$properties_limit_of_selected_plan.". Note that if you continue with ".$pricePlan->name." plan, we will unassign the properties of the annotations you made during the ".$user->pricePlan->name.", you can Edit them later.";
            $showAlerts[] =  'property-alert';
            $alertText[] =  $text;
        }
        //Alert for google analytics Property End
        //Alert for Apps Start
        $app_in_use = CheckUserUsageHelper::checkAppsInUse($user,$pricePlan);
        if(count($app_in_use) > 0)
        {  
            $text = "During the ".$user->pricePlan->name." you activated ".implode(", ",$app_in_use).". Note that if you continue with ".$pricePlan->name." we will deactivate the automations and you will no longer be able to view the annotations";
            $showAlerts[] =  'apps-in-use-alert';
            $alertText[] =  $text;
            // return response()->json(['success' => false, 'message' => $text], 422);
        }
        //Alert for Apps End
        //Alert for Co-worker Invite Start
        if($pricePlan->user_per_ga_account_count != 0)
        {
            $extra_users = CheckUserUsageHelper::checkExtraUser($user,$pricePlan);
            $total_co_users = User::where('user_id',$user->id)->count();
            if(count($extra_users) > 0)
            {  
                $text = "During the ".$user->pricePlan->name." ".$total_co_users." co-workers joined the account. Note that if you continue with ".$pricePlan->name." ".implode(", ",$extra_users)." will lose access";
                $showAlerts[] =  'extra-users-alert';
                $alertText[] =  $text;
            }
        }
        //Alert for Co-worker Invite End
        //Alert for Notifcation Start
        if(!$pricePlan->has_notifications)
        {
           $notifications =  NotificationSetting::where('user_id', $user->id)->where('is_enabled',1)->get()->pluck('label')->toArray();
           if(count($notifications) > 0)
           {
                $text = "During the ".$user->pricePlan->name." ".count($notifications)." notifications are enabled. Note that if you continue with ".$pricePlan->name." ".implode(", ",$notifications)." will be disabled.";
                $showAlerts[] =  'notification-alert';
                $alertText[] =  $text;
           }
        }
        //Alert For Notification End
        return ['success' => true, 'showAlerts' => $showAlerts, 'alertText' => $alertText];
    }
}
