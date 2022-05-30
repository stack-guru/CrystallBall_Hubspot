<?php

namespace App\Http\Controllers\API\AppSumo;

use App\Events\UserTrialPricePlanEnded;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppSumoLicenseRequest;
use App\Models\AppSumoRequest;
use App\Models\Admin;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\NotificationSetting;
use App\Models\UserDataSource;
use App\Models\PricePlan;
use App\Mail\AdminPlanUpgradedMail;
use App\Models\PricePlanSubscription;
use App\Models\WebMonitor;
use App\Services\SendGridService;
use Illuminate\Support\Str;

class LicenseController extends Controller
{

    public function handler(AppSumoLicenseRequest $request)
    {
        $appSumoRequest = new AppSumoRequest;
        $appSumoRequest->fill($request->validated());
        $appSumoRequest->save();

        switch ($request->action) {
            case 'activate':
                $user = User::where('email', $request->activation_email)->first();
                if (!$user) {
                    // If the user is purchasing license from AppSumo
                    // for the first time
                    $user = new User;
                    $user->name = 'Sumo-ling';
                    $user->email = $request->activation_email;
                    $user->password = User::EMPTY_PASSWORD;
                } else {
                    // If the user is an old user but now purchasing
                    // a license from AppSumo
                }
                $user->price_plan_id = $request->plan_id;
                $user->price_plan_expiry_date = new \DateTime("+100 years");
                $user->is_billing_enabled = false;
                $user->app_sumo_uuid = $request->uuid;
                $user->identification_code = Str::random(100);
                $user->save();

                $this->addPricePlanSubscription(null, $user->id, null, $request->plan_id, 0, null, 0, $request->invoice_item_uuid);

                event(new \Illuminate\Auth\Events\Registered($user));

                return response([
                    "message" => "User created with the given price plan.",
                    "redirect_url" => route('app-sumo.password.index', ['identification-code' => $user->identification_code])
                ], 201);
                break;
            case 'enhance_tier':
                $user = User::where('email', $request->activation_email)->first();
                $pricePlan = PricePlan::find($request->plan_id);

                $user->price_plan_id = $request->plan_id;
                $user->price_plan_expiry_date = new \DateTime("+100 years");
                $user->is_billing_enabled = false;
                $user->save();
                $user->refresh();

                $sGS = new SendGridService;

                switch ($pricePlan->name) {
                    case PricePlan::BASIC:
                        $sGS->addUserToMarketingList($user, "9 GAa Upgraded to Basic");
                        WebMonitor::addAllowedWebMonitors($user, $pricePlan->web_monitor_count);
                        $admin = Admin::first();
                        Mail::to($admin)->send(new AdminPlanUpgradedMail($admin, $user));
                        break;
                    case PricePlan::PRO:
                        $sGS->addUserToMarketingList($user, "10 GAa Upgraded to PRO");
                        WebMonitor::addAllowedWebMonitors($user, $pricePlan->web_monitor_count);
                        $admin = Admin::first();
                        Mail::to($admin)->send(new AdminPlanUpgradedMail($admin, $user));
                        break;
                }

                $this->addPricePlanSubscription(null, $user->id, null, $request->plan_id, 0, null, 0, null);

                return [
                    "message" => "Price Plan changed.",
                ];
                break;
            case 'reduce_tier':
                $user = User::where('email', $request->activation_email)->first();
                $pricePlan = PricePlan::find($request->plan_id);

                $user->price_plan_id = $request->plan_id;
                $user->price_plan_expiry_date = new \DateTime("+100 years");
                $user->is_billing_enabled = false;
                $user->save();
                $user->refresh();

                $sGS = new SendGridService;
                WebMonitor::removeAdditionalWebMonitors($user, $pricePlan->web_monitor_count);
                $this->addPricePlanSubscription(null, $user->id, null, $request->plan_id, 0, null, 0, null);
                return [
                    "message" => "Price Plan changed.",
                ];
                break;
            case 'refund':
                $user = User::where('email', $request->activation_email)->first();
                $pricePlan = PricePlan::find($request->plan_id);
                $downgradePricePlan = PricePlan::where('price', 0)->where('code', PricePlan::CODE_FREE_NEW)->first();

                $user->price_plan_expiry_date = new \DateTime("+100 years");
                $user->price_plan_id = $downgradePricePlan->id;

                WebMonitor::removeAdditionalWebMonitors($user, $downgradePricePlan->web_monitor_count);
                UserDataSource::disableDataSources($user);
                NotificationSetting::disableNotifications($user);

                $user->save();

                $this->addPricePlanSubscription(null, $user->id, null, $downgradePricePlan->id, 0, null, 0, $request->invoice_item_uuid);

                event(new UserTrialPricePlanEnded($user));
                return ['message' => 'User downgraded to most restricted price plan.'];
                break;
        }
    }

    private function addPricePlanSubscription($transactionId, $userId, $paymentDetailId, $pricePlanId, $chargedPrice, $couponId = null, $couponLeftRecurringCount = 0, $appSumoInvoiceId = null)
    {
        $pricePlanSubscription = new PricePlanSubscription;
        $pricePlanSubscription->transaction_id = $transactionId;
        $pricePlanSubscription->expires_at = new \DateTime("+100 years");
        $pricePlanSubscription->user_id = $userId;
        $pricePlanSubscription->payment_detail_id = $paymentDetailId;
        $pricePlanSubscription->price_plan_id = $pricePlanId;
        $pricePlanSubscription->charged_price = $chargedPrice;
        $pricePlanSubscription->coupon_id = $couponId;
        $pricePlanSubscription->left_coupon_recurring = $couponLeftRecurringCount;
        $pricePlanSubscription->app_sumo_invoice_item_uuid = $appSumoInvoiceId;
        $pricePlanSubscription->save();
        return $pricePlanSubscription->id;
    }
}
