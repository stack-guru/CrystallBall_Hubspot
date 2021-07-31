<?php

namespace App\Http\Controllers;

use App\Events\GoogleUpdatesActivated;
use App\Events\GoogleUpdatesDeactivatedManually;
use App\Events\HolidaysDeactivatedManually;
use App\Events\NewsAlertDeactivatedManually;
use App\Events\RetailMarketingDatesActivated;
use App\Events\RetailMarketingDatesDeactivated;
use App\Events\WeatherForCitiesDeactivatedManually;
use App\Events\WebsiteMonitoringDeactivated;
use App\Events\WordPressActivated;
use App\Events\WordPressDeactivatedManually;
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
                event(new HolidaysDeactivatedManually($user));
            }
            $user->save();
        }
        if ($request->has('is_ds_google_algorithm_updates_enabled')) {
            $user->is_ds_google_algorithm_updates_enabled = $request->is_ds_google_algorithm_updates_enabled;
            if ($request->is_ds_google_algorithm_updates_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
                event(new GoogleUpdatesActivated($user));
            } else {
                event(new GoogleUpdatesDeactivatedManually($user));
            }
            $user->save();
        }
        if ($request->has('is_ds_retail_marketing_enabled')) {
            $user->is_ds_retail_marketing_enabled = $request->is_ds_retail_marketing_enabled;
            if ($request->is_ds_retail_marketing_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
                event(new RetailMarketingDatesActivated($user));
            } else {
                event(new RetailMarketingDatesDeactivated($user));
            }
            $user->save();
        }
        if ($request->has('is_ds_weather_alerts_enabled')) {
            $user->is_ds_weather_alerts_enabled = $request->is_ds_weather_alerts_enabled;
            if ($request->is_ds_weather_alerts_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                event(new WeatherForCitiesDeactivatedManually($user));
            }
            $user->save();
        }
        if ($request->has('is_ds_google_alerts_enabled')) {
            $user->is_ds_google_alerts_enabled = $request->is_ds_google_alerts_enabled;
            if ($request->is_ds_google_alerts_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                event(new NewsAlertDeactivatedManually($user));
            }
            $user->save();
        }
        if ($request->has('is_ds_wordpress_updates_enabled')) {
            $user->is_ds_wordpress_updates_enabled = $request->is_ds_wordpress_updates_enabled;
            if ($request->is_ds_wordpress_updates_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
                event(new WordPressActivated($user));
            } else {
                event(new WordPressDeactivatedManually($user));
            }
            $user->save();
        }
        if ($request->has('is_ds_web_monitors_enabled')) {
            $user->is_ds_web_monitors_enabled = $request->is_ds_web_monitors_enabled;
            if ($request->is_ds_web_monitors_enabled) {
                $user->last_activated_any_data_source_at = Carbon::now();
            } else {
                event(new WebsiteMonitoringDeactivated($user));
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

    public function markDataSourceTourDone(Request $request)
    {
        $user = Auth::user();
        $user->data_source_tour_showed_at = \Carbon\Carbon::now();
        $user->save();

        return ['success' => true];
    }

    public function markGoogleAccountsTourDone(Request $request)
    {
        $user = Auth::user();
        $user->google_accounts_tour_showed_at = \Carbon\Carbon::now();
        $user->save();

        return ['success' => true];
    }
}
