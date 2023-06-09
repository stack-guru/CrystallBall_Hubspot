<?php

namespace App\Http\Controllers;

use App\Events\GoogleAlertActivated;
use App\Events\GoogleAlertDeactivatedManually;
use App\Events\GoogleUpdatesActivated;
use App\Events\GoogleUpdatesDeactivatedManually;
use App\Events\HolidaysActivated;
use App\Events\HolidaysDeactivatedManually;
use App\Events\RetailMarketingDatesActivated;
use App\Events\RetailMarketingDatesDeactivated;
use App\Events\WeatherActivated;
use App\Events\WeatherForCitiesDeactivatedManually;
use App\Events\WebsiteMonitoringActivated;
use App\Events\WebsiteMonitoringDeactivated;
use App\Events\WordPressActivated;
use App\Events\WordPressDeactivatedManually;
use App\Mail\AdminUserSuspendedAccount;
use App\Mail\SupportRequestMail;
use App\Models\Admin;
use App\Models\User;
use App\Models\UserRegistrationOffer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class HomeController extends Controller
{
    public function uiUserShow()
    {
        /**
         * @var User
         */
        $user = Auth::user();
        $user->load('pricePlan');
        $user->loadCount('googleAccounts');
        $user->show_configuration_message = false;
        if ($user->last_login_at == null) {
            User::where('id', $user->id)
                ->update([
                    'last_login_at' => new \DateTime,
                ]);
        }
        if ($user->password === User::EMPTY_PASSWORD && $user->has_password == true) {
            $user->show_password_message = true;
        } else {
            $user->show_password_message = false;
            if ($user->starterConfigurationChecklist()->count() != $user->userStarterConfigurationChecklist()->count()) {
                $user->starter_configuration_checklist = $user->starterConfigurationChecklist();
                $user->user_starter_configuration_checklist = $user->userStarterConfigurationChecklist();
                $user->user_starter_configuration_checklist_count = $user->userStarterConfigurationChecklist()->count();
                $user->show_configuration_message = true;
            }
        }
        // $user->annotations_count = $user->getTotalAnnotationsCount(true);
        $user->is_login_with_google = $user->password === User::EMPTY_PASSWORD && $user->has_password == false;
        $user->google_analytics_properties_in_use_count = $user->googleAnalyticsPropertiesInUse()->count();
        $user->do_require_password_change = ($user->password == User::EMPTY_PASSWORD && !is_null($user->app_sumo_uuid));
        $user->user_registration_offers = $user->pricePlan->price == 0 ? UserRegistrationOffer::ofCurrentUser()->alive()->get() : [];
        if($user->show_trail_popup)
        {
            $user->trail_plan_status = true;

            User::where('id', $user->id)
                ->update([
                    'show_trail_popup' => false,
                ]);
        }else{
            $user->trail_plan_status = false;
        }

        return ['user' => $user];
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function deleteAccount(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user->user) {
            abort(403, 'Only the admin can delete the account.');
        }

        $user->status = User::STATUS_DELETED;
        $user->status_changed_reason = $request->deletion_reason ?? '';
        $user->save();

        Auth::logout();

        foreach (Admin::all() as $admin) {
            Mail::to($admin)->send(new AdminUserSuspendedAccount($admin, $user, $request->deletion_reason));
        }

        return redirect()->route('login')->with('message', 'Your account is deleted.');
    }

    private function checkPricePlanLimit($user)
    {
        if ($user->isPricePlanAnnotationLimitReached(true)) {
            abort(402, "Please upgrade your plan to add more annotations");
        }
        if (!$user->pricePlan->has_data_sources) {
            abort(402, "Please upgrade your plan to use Data Sources feature.");
        }
    }

    public function userServices(Request $request)
    {
        /**
         * @var User
         */
        $user = Auth::user();
        $this->enableDisableProperties($request);

        $response['twitter_accounts'] = $user->twitterAccounts()->count();
        $response['user_services'] = User::find($user->id);
        return $response;
    }

    public function enableDisableProperties($request)
    {

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();
        foreach ($userIdsArray as $userId) {
            $user = User::find($userId);

            $response = [];
            if ($request->has('is_ds_holidays_enabled')) {
                $user->is_ds_holidays_enabled = $request->is_ds_holidays_enabled;
                if ($request->is_ds_holidays_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new HolidaysActivated($user));
                } else {
                    // event(new HolidaysDeactivatedManually($user));
                }
            }

            if ($request->has('is_ds_google_algorithm_updates_enabled')) {
                $user->is_ds_google_algorithm_updates_enabled = $request->is_ds_google_algorithm_updates_enabled;
                if ($request->is_ds_google_algorithm_updates_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new GoogleUpdatesActivated($user));
                } else {
                    // event(new GoogleUpdatesDeactivatedManually($user));
                }
            }

            if ($request->has('is_ds_retail_marketing_enabled')) {
                $user->is_ds_retail_marketing_enabled = $request->is_ds_retail_marketing_enabled;
                if ($request->is_ds_retail_marketing_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new RetailMarketingDatesActivated($user));
                } else {
                    // event(new RetailMarketingDatesDeactivated($user));
                }
            }

            if ($request->has('is_ds_weather_alerts_enabled')) {
                $user->is_ds_weather_alerts_enabled = $request->is_ds_weather_alerts_enabled;
                if ($request->is_ds_weather_alerts_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new WeatherActivated($user));
                } else {
                    // event(new WeatherForCitiesDeactivatedManually($user));
                }
            }

            if ($request->has('is_ds_google_alerts_enabled')) {
                $user->is_ds_google_alerts_enabled = $request->is_ds_google_alerts_enabled;
                if ($request->is_ds_google_alerts_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new GoogleAlertActivated($user));
                } else {
                    // event(new GoogleAlertDeactivatedManually($user));
                }
            }

            if ($request->has('is_ds_wordpress_updates_enabled')) {
                $user->is_ds_wordpress_updates_enabled = $request->is_ds_wordpress_updates_enabled;
                if ($request->is_ds_wordpress_updates_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new WordPressActivated($user));
                } else {
                    // event(new WordPressDeactivatedManually($user));
                }
            }

            if ($request->has('is_ds_web_monitors_enabled')) {
                $user->is_ds_web_monitors_enabled = $request->is_ds_web_monitors_enabled;
                if ($request->is_ds_web_monitors_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new WebsiteMonitoringActivated($user));
                } else {
                    // event(new WebsiteMonitoringDeactivated($user));
                }
            }

            if ($request->has('is_ds_apple_podcast_annotation_enabled')) {
                $user->is_ds_apple_podcast_annotation_enabled = $request->is_ds_apple_podcast_annotation_enabled;
                if ($request->is_ds_apple_podcast_annotation_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                }
            }
            if ($request->has('is_ds_youtube_tracking_enabled')) {
                $user->is_ds_youtube_tracking_enabled = $request->is_ds_youtube_tracking_enabled;
                if ($request->is_ds_youtube_tracking_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                }
            }

            if ($request->has('is_ds_shopify_annotation_enabled')) {
                $user->is_ds_shopify_annotation_enabled = $request->is_ds_shopify_annotation_enabled;
                if ($request->is_ds_shopify_annotation_enabled) {
                    $this->checkPricePlanLimit($user);
                    $user->last_activated_any_data_source_at = Carbon::now();
                    event(new WebsiteMonitoringActivated($user));
                } else {
                    // event(new WebsiteMonitoringDeactivated($user));
                }
            }

            if ($request->has('is_ds_g_ads_history_change_enabled')) {
                $user->is_ds_g_ads_history_change_enabled = $request->is_ds_g_ads_history_change_enabled;
            }

            if ($request->has('is_ds_anomolies_detection_enabled')) {
                $user->is_ds_anomolies_detection_enabled = $request->is_ds_anomolies_detection_enabled;
            }

            if ($request->has('is_ds_budget_tracking_enabled')) {
                $user->is_ds_budget_tracking_enabled = $request->is_ds_budget_tracking_enabled;
            }

            if ($request->has('is_ds_keyword_tracking_enabled')) {
                $user->is_ds_keyword_tracking_enabled = $request->is_ds_keyword_tracking_enabled;
            }

            if ($request->has('is_ds_bitbucket_tracking_enabled')) {
                $user->is_ds_bitbucket_tracking_enabled = $request->is_ds_bitbucket_tracking_enabled;
            }

            if ($request->has('is_ds_github_tracking_enabled')) {
                $user->is_ds_github_tracking_enabled = $request->is_ds_github_tracking_enabled;
            }

            if ($request->has('is_ds_facebook_tracking_enabled')) {
                $user->is_ds_facebook_tracking_enabled = $request->is_ds_facebook_tracking_enabled;
            }

            if ($request->has('is_ds_google_tag_manager_enabled')) {
                $user->is_ds_google_tag_manager_enabled = $request->is_ds_google_tag_manager_enabled;
            }

            if ($request->has('is_ds_instagram_tracking_enabled')) {
                $user->is_ds_instagram_tracking_enabled = $request->is_ds_instagram_tracking_enabled;
            }

            if ($request->has('is_ds_instagram_tracking_enabled')) {
                $user->is_ds_instagram_tracking_enabled = $request->is_ds_instagram_tracking_enabled;
            }

            if ($request->has('is_ds_twitter_tracking_enabled')) {

                $twitterAccounts = $user->twitterAccounts()->count();

                if ($twitterAccounts > 0) {
                    $user->is_ds_twitter_tracking_enabled = $request->is_ds_twitter_tracking_enabled;
                }

            }

            if ($request->has('is_ds_wordpress_enabled')) {
                $user->is_ds_wordpress_enabled = $request->is_ds_wordpress_enabled;
            }

            $user->save();

        }

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

    public function updatePhone(Request $request)
    {
        // return $request->timezone;
        $request->validate([
            'phone' => 'nullable|string',
        ]);
        $user = Auth::user();
        if ($user->phone_number !== $request->phone) {
            $user->phone_verified_at = null;
        }

        $user->phone_number = $request->phone;
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'Phone updated successfully'], 200);
    }

    public function updateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
        ]);
        $user = Auth::user();
        if ($user->email !== $request->email) {
            $user->email_verified_at = null;
        }

        $user->email = $request->email;
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'Email updated successfully'], 200);
    }

    public function updateProfile(Request $request)
    {

        $this->validate($request, [
            'profile_image' => 'required',
        ]);

        $file = $request->file('profile_image');
        $filename = time() . '_' . $file->getClientOriginalName();

        // File extension
        $extension = $file->getClientOriginalExtension();
        // File upload location
        $location = 'profiles';
        // Upload file
        $file->move($location, $filename);
        // File path
        // $filepath = url('files/'.$filename);
        // return $filepath;

        $user = Auth::user();
        $user->profile_image = 'profiles/' . $filename;
        $user->save();
        return response()->json(['success' => 'true', 'profile_image' => $user->profile_image, 'message' => 'Profile Image updated successfully'], 200);


    }

    public function updateUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string',
            'website' => 'nullable|string',
            'timezone' => 'required',
        ]);

        $user = Auth::user();
        if ($user->email !== $request->email) {
            $user->email_verified_at = null;
        }
        if ($user->phone_number !== $request->phone) {
            $user->phone_verified_at = null;
        }

        $user->name = $request->name;
        $user->name = $request->name;
        $user->website = $request->website;
        $user->phone_number = $request->phone;
        $user->timezone = $request->timezone;
        $user->save();
        return response()->json(['success' => 'true', 'message' => 'User updated successfully'], 200);
    }
}
