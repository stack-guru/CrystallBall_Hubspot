<?php

namespace App\Http\Controllers\API\AppSumo;

use App\Events\UserTrialPricePlanEnded;
use App\Http\Controllers\Controller;
use App\Models\AppSumoUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\AppSumoLicenseRequest;
use App\Models\AppSumoRequest;
use App\Models\Admin;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\NotificationSetting;
use App\Models\UserDataSource;
use App\Models\PricePlan;
use App\Mail\AdminPlanUpgradedMail;
use App\Models\WebMonitor;
use App\Services\SendGridService;

class LicenseController extends Controller
{

    public function handler(AppSumoLicenseRequest $request)
    {
        $appSumoRequest = new AppSumoRequest;
        $appSumoRequest->fill($request->validated());
        $appSumoRequest->save();

        switch ($request->action) {
            case 'activate':

                $user = new User;
                $user->name = 'Sumo-ling';
                $user->email = $request->activation_email;
                $user->password = '.';
                $user->price_plan_id = $request->plan_id;
                $user->price_plan_expiry_date = new \DateTime("+1 month");
                $user->is_billing_enabled = false;
                $user->save();

                event(new \Illuminate\Auth\Events\Registered($user));

                return response([
                    "message" => "Your created with the given price plan.",
                    "redirect_url" => route('app-sumo.set-password', ['registration-key' => 'new-registration-key'])
                ], 201);
                break;
            case 'enhance_tier':
                $user = User::where('email', $request->activation_email)->first();
                $pricePlan = PricePlan::find($request->plan_id);

                $user->price_plan_id = $request->plan_id;
                $user->price_plan_expiry_date = new \DateTime("+1 month");
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

                return [
                    "message" => "Price Plan changed.",
                ];
                break;
            case 'reduce_tier':
                $user = User::where('email', $request->activation_email)->first();
                $pricePlan = PricePlan::find($request->plan_id);

                $user->price_plan_id = $request->plan_id;
                $user->price_plan_expiry_date = new \DateTime("+1 month");
                $user->is_billing_enabled = false;
                $user->save();
                $user->refresh();

                $sGS = new SendGridService;
                WebMonitor::removeAdditionalWebMonitors($user, $pricePlan->web_monitor_count);
                return [
                    "message" => "Price Plan changed.",
                ];
                break;
            case 'refund':
                $user = User::where('email', $request->activation_email)->first();
                $pricePlan = PricePlan::find($request->plan_id);
                $downgradePricePlan = PricePlan::where('price', 0)->where('name', PricePlan::TRIAL_ENDED)->first();

                $user->price_plan_expiry_date = new \DateTime("+1 month");
                $user->price_plan_id = $downgradePricePlan->id;

                WebMonitor::removeAdditionalWebMonitors($user, $downgradePricePlan->web_monitor_count);
                UserDataSource::disableDataSources($user);
                NotificationSetting::disableNotifications($user);

                $user->save();

                event(new UserTrialPricePlanEnded($user));
                return ['message' => 'User downgraded to most restricted price plan.'];
                break;
        }
    }
}
