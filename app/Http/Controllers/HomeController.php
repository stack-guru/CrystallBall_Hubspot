<?php

namespace App\Http\Controllers;

use App\Mail\SupportRequestMail;
use App\Models\User;
use App\Services\SendGridService;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class HomeController extends Controller
{
    public function uiUserShow()
    {
        $user = Auth::user();
        $user->load('pricePlan');
        if ($user->last_login_at == null) {
            User::where('id', $user->id)
                ->update([
                    'last_login_at' => new \DateTime,
                ]);
        }

        return ['user' => $user];
    }

    public function userServices(Request $request)
    {

        $user = Auth::user();
        if (!$user->pricePlan->has_data_sources) {
            abort(402);
        }

        $sGS = new SendGridService;

        if ($request->has('is_ds_holidays_enabled')) {
            $user->is_ds_holidays_enabled = $request->is_ds_holidays_enabled;
            if ($request->is_ds_holidays_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                $sGS->addUserToContactList($user, "Holidays for [Country_name] Deactivated manually");
            }
            $user->save();
        }
        if ($request->has('is_ds_google_algorithm_updates_enabled')) {
            $user->is_ds_google_algorithm_updates_enabled = $request->is_ds_google_algorithm_updates_enabled;
            if ($request->is_ds_google_algorithm_updates_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
                $sGS->addUserToContactList($user, "Google Updates Activated");
            } else {
                $sGS->addUserToContactList($user, "Google Updates Deactivated manually");
            }
            $user->save();
        }
        if ($request->has('is_ds_retail_marketing_enabled')) {
            $user->is_ds_retail_marketing_enabled = $request->is_ds_retail_marketing_enabled;
            if ($request->is_ds_retail_marketing_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
                $sGS->addUserToContactList($user, "Retail Marketing Dates Activated");
            } else {
                $sGS->addUserToContactList($user, "Retail Marketing Dates Deactivated manually");
            }
            $user->save();
        }
        if ($request->has('is_ds_weather_alerts_enabled')) {
            $user->is_ds_weather_alerts_enabled = $request->is_ds_weather_alerts_enabled;
            if ($request->is_ds_weather_alerts_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                $sGS->addUserToContactList($user, "Weather for [cities] Deactivated manually");
            }
            $user->save();
        }
        if ($request->has('is_ds_google_alerts_enabled')) {
            $user->is_ds_google_alerts_enabled = $request->is_ds_google_alerts_enabled;
            if ($request->is_ds_google_alerts_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                $sGS->addUserToContactList($user, "News Alerts for [keywords] Deactivated manually");
            }
            $user->save();
        }
        if ($request->has('is_ds_wordpress_updates_enabled')) {
            $user->is_ds_wordpress_updates_enabled = $request->is_ds_wordpress_updates_enabled;
            if ($request->is_ds_wordpress_updates_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
                $sGS->addUserToContactList($user, "WordPress Activated");
            } else {
                $sGS->addUserToContactList($user, "WordPress Deactivated manually");
            }
            $user->save();
        }
        if ($request->has('is_ds_web_monitors_enabled')) {
            $user->is_ds_web_monitors_enabled = $request->is_ds_web_monitors_enabled;
            if ($request->is_ds_web_monitors_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                $sGS->addUserToContactList($user, "Website Monitoring Deactivated because URL was removed");
            }
            $user->save();
        }

        return ['user_services' => $user];

    }

    public function storeSupport(Request $request)
    {
        $this->validate($request, [
            'details' => 'required|string',
            'attachment' => 'nullable|file',
        ]);

        if ($request->hasFile('attachment')) {
            $sRM = new SupportRequestMail(Auth::user(), $request->details, $request->file('attachment')->path(), $request->file('attachment')->getClientOriginalExtension());
        } else {
            $sRM = new SupportRequestMail(Auth::user(), $request->details);
        }
        Mail::to(config('sl.support.email'))->send($sRM);

        return ['sucess' => true];
    }

    public function updateTimezone(Request $request)
    {
        // return $request->timezone;
        $request->validate([
            'timezone' => 'required',
        ]);
        $user = Auth::user();
        $user->timezone = $request->timezone;
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'TimeZone updated successfully'], 200);
    }

}
