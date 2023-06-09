<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Requests\UserRequest;
use App\Mail\DailyUserStatsMail;
use App\Mail\UserInviteMail;
use App\Models\GoogleAnalyticsProperty;
use App\Models\PricePlan;
use App\Models\PricePlanSubscription;
use App\Models\User;
use App\Models\UserActiveDevice;
use App\Models\UserGaAccount;
use App\Models\Annotation;
use Illuminate\Support\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return view('ui/app');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function uiIndex()
    {
        $this->authorize('viewAny', User::class);
        $user = Auth::user();
        if (!$user) {
            abort(404, "Unable to find user with the given id.");
        }

        $users = $user->user_id && $user->user ? $user->user->users : $user->users;

        // Append Google Analytics properties for each user
        foreach ($users as $user) {
            $user->google_analytics_properties = $this->getUniqueGoogleAnalyticsPropertiesByUser($user);
        }

        return ['users' => $users];
    }

    public function show(User $user)
    {

        $this->authorize('view', $user);

        if ($user->user_id !== Auth::id()) {
            abort(404, "Unable to find user with the given id.");
        }

        $user->google_analytics_properties = $this->getUniqueGoogleAnalyticsPropertiesByUser($user);

        return ['user' => $user];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {

        $this->authorize('create', User::class);
        $parentUser = Auth::user();

        if ($parentUser->user_id) {
            $parentUser = User::find($parentUser->user_id);
        }

        if ($parentUser->pricePlan->user_per_ga_account_count == -1) {
            return response()->json([
                'message' => 'Action not allowed in your plan.'
            ], 455);
        } // if limit of users has reached
        else if ($parentUser->pricePlan->user_per_ga_account_count > 0 && count($parentUser->users) >= ($parentUser->pricePlan->user_per_ga_account_count)) {
            return response()->json([
                'message' => 'To add more users, please upgrade your account.'
            ], 455);
        } else if ($parentUser->trailPlanStatus() == true) {
            return response()->json([
                'message' => 'Your trial is ended.To add more users, please upgrade your account.'
            ], 455);
        }
        $user = new User;
        $user->fill($request->validated());
        $user->password = $request->password ? Hash::make($request->password) : '.';
        $user->user_id = $parentUser->id;
        $user->price_plan_id = $parentUser->price_plan_id;
        $user->price_plan_expiry_date = $parentUser->price_plan_expiry_date;
        $user->show_config_steps = 0;
        $user->startup_configuration_showed_at = Carbon::now();
        $user->assigned_properties_id = implode(',', $request->google_analytics_property_id);
        if ($parentUser->is_ds_holidays_enabled) {
            $user->is_ds_holidays_enabled = 1;
        }

        if ($parentUser->is_ds_google_algorithm_updates_enabled) {
            $user->is_ds_google_algorithm_updates_enabled = 1;
        }

        if ($parentUser->is_ds_retail_marketing_enabled) {
            $user->is_ds_retail_marketing_enabled = 1;
        }

        if ($parentUser->is_ds_weather_alerts_enabled) {
            $user->is_ds_weather_alerts_enabled = 1;
        }

        if ($parentUser->is_ds_google_alerts_enabled) {
            $user->is_ds_google_alerts_enabled = 1;
        }

        if ($parentUser->is_ds_wordpress_updates_enabled) {
            $user->is_ds_wordpress_updates_enabled = 1;
        }

        if ($parentUser->is_ds_web_monitors_enabled) {
            $user->is_ds_web_monitors_enabled = 1;
        }

        if ($parentUser->is_ds_apple_podcast_annotation_enabled) {
            $user->is_ds_apple_podcast_annotation_enabled = 1;
        }

        if ($parentUser->is_ds_shopify_annotation_enabled) {
            $user->is_ds_shopify_annotation_enabled = 1;
        }

        if ($parentUser->is_ds_g_ads_history_change_enabled) {
            $user->is_ds_g_ads_history_change_enabled = 1;
        }

        if ($parentUser->is_ds_anomolies_detection_enabled) {
            $user->is_ds_anomolies_detection_enabled = 1;
        }

        if ($parentUser->is_ds_budget_tracking_enabled) {
            $user->is_ds_budget_tracking_enabled = 1;
        }

        if ($parentUser->is_ds_keyword_tracking_enabled) {
            $user->is_ds_keyword_tracking_enabled = 1;
        }

        if ($parentUser->is_ds_bitbucket_tracking_enabled) {
            $user->is_ds_bitbucket_tracking_enabled = 1;
        }

        if ($parentUser->is_ds_github_tracking_enabled) {
            $user->is_ds_github_tracking_enabled = 1;
        }

        if ($parentUser->is_ds_facebook_tracking_enabled) {
            $user->is_ds_facebook_tracking_enabled = 1;
        }
        
        if ($parentUser->is_ds_google_tag_manager_enabled) {
            $user->is_ds_google_tag_manager_enabled = 1;
        }

        if ($parentUser->is_ds_instagram_tracking_enabled) {
            $user->is_ds_instagram_tracking_enabled = 1;
        }

        if ($parentUser->is_ds_twitter_tracking_enabled) {
            $user->is_ds_twitter_tracking_enabled = 1;
        }

        if ($parentUser->is_ds_wordpress_enabled) {
            $user->is_ds_wordpress_enabled = 1;
        }

        $user->save();




        $gaAccountIds = [];
        $gaProperties = GoogleAnalyticsProperty::whereIn('id', $request->google_analytics_property_id)->with(['googleAnalyticsAccount'])->get();

        foreach ($gaProperties as $property) {
            $gaAccountIds[] = $property->googleAnalyticsAccount->id;
        }

        if ($gaAccountIds !== null && !in_array("", $gaAccountIds)) {
            foreach ($gaAccountIds as $gAAId) {
                $uGAA = new UserGaAccount;
                $uGAA->user_id = $user->id;
                $uGAA->google_analytics_account_id = $gAAId;
                $uGAA->save();
            }
        } else {
            $uGAA = new UserGaAccount;
            $uGAA->user_id = $user->id;
            $uGAA->google_analytics_account_id = null;
            $uGAA->save();
        }

        $user->google_analytics_properties = $this->getUniqueGoogleAnalyticsPropertiesByUser($user);
        Mail::to($user)->send(new UserInviteMail($user));
        event(new \App\Events\UserInvitedTeamMember($parentUser));

        return ['user' => $user];
    }

    public function reInviteUser(Request $request)
    {
        $user = User::find($request->userId);
        Mail::to($user)->send(new UserInviteMail($user));
        $user->created_at = Carbon::now();
        $user->save();

        $user = Auth::user();
        $users = $user->user_id ? $user->user->users : $user->users;
        return ['users' => $users];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $user->fill($request->validated());
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $parentUser = Auth::user();
        $user->user_id = $parentUser->id;
        $user->price_plan_id = $parentUser->price_plan_id;
        $user->price_plan_expiry_date = $parentUser->price_plan_expiry_date;
        $user->assigned_properties_id = implode(',', $request->google_analytics_property_id);
        $user->save();

        $uGAAs = $user->userGaAccounts;
        $oldGAAIds = $uGAAs->pluck('google_analytics_account_id')->toArray();

        // Remove empty strings from the array
        $filteredPropertyIds = array_filter($request->google_analytics_property_id, function ($value) {
            return $value !== "";
        });

        // Fetch the Google Analytics properties
        $gaProperties = GoogleAnalyticsProperty::whereIn('id', $filteredPropertyIds)->with(['googleAnalyticsAccount'])->get();

        // Get the new Google Analytics Account IDs
        $newGAAIds = [];
        foreach ($gaProperties as $property) {
            $newGAAIds[] = $property->googleAnalyticsAccount->id;
        }

        // Delete old UserGaAccounts that are not in the new list
        foreach ($uGAAs as $uGAA) {
            if (!in_array($uGAA->google_analytics_account_id, $newGAAIds)) {
                $uGAA->delete();
            }
        }

        // Create new UserGaAccounts that are not in the old list
        foreach ($newGAAIds as $gAAId) {
            if (!in_array($gAAId, $oldGAAIds)) {
                $uGAA = new UserGaAccount;
                $uGAA->user_id = $user->id;
                $uGAA->google_analytics_account_id = $gAAId;
                $uGAA->save();
            }
        }

        $user->google_analytics_properties = $this->getUniqueGoogleAnalyticsPropertiesByUser($user);

        return ['user' => $user];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        if ($user->user_id) {
            Annotation::where('user_id', $user->id)->update(['user_id' => $user->user_id, 'added_by_name' => $user->name]);
        }
        $user->email = Carbon::now()->format('Ymd') . '_' . $user->email;
        $user->save();
        $user->delete();

        return ['success' => true];
    }

    public function getTeamName()
    {
        return ['team_names' => DB::table('users')->where('user_id', Auth::id())->whereNotNull('team_name')->select('team_name')->distinct()->get()];
    }

    public function sendEmailWithUserStatsToAdmin()
    {
        $users = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('last90DaysApiAnnotationCreatedLogs')
            ->withCount('last90DaysNotificationLogs')
            ->withCount('last90DaysLoginLogs')
            ->orderBy('created_at', 'DESC')
            ->where('name', 'NOT LIKE', '%test%')
            ->get();

        $active_users_in_90_days = 0;
        $last6MonthsActiveUsers = 0;

        foreach ($users as $user) {
            if (
                $user->last90_days_popup_opened_chrome_extension_logs_count
                || $user->last90_days_annotation_button_clicked_chrome_extension_logs_count
                || $user->last90_days_api_annotation_created_logs_count
                || $user->last90_days_notification_logs_count
                || @$user->pricePlan->price
                || $user->last90_days_login_logs_count
            ) {
                $active_users_in_90_days++;
                $last6MonthsActiveUsers++;
            }
        }

        $active_users_yesterday = (new DashboardController())->active_users_yesterday();
        $active_users_in_30_days = (new DashboardController())->active_users_in_30_days();
        $active_users_in_60_days = (new DashboardController())->active_users_in_60_days();

        $total_registration_count = User::where('name', 'NOT LIKE', '%test%')->count();
        $yesterday_registration_count = User::where('created_at', '>=', Carbon::now()->subDay(1)->format('Y-m-d'))->where('name', 'NOT LIKE', '%test%')->count();
        $yesterday_registration_users = User::where('created_at', '>=', Carbon::now()->subDay(1)->format('Y-m-d'))->where('name', 'NOT LIKE', '%test%')->pluck('name', 'email')->toArray();
        $last_week_registration_count = User::where('created_at', '>=', Carbon::now()->subDay(7)->format('Y-m-d'))->where('name', 'NOT LIKE', '%test%')->count();
        $current_month_registration_count = User::where('created_at', '>=', Carbon::now()->startOfMonth()->format('Y-m-d'))->where('name', 'NOT LIKE', '%test%')->count();
        $previous_month_registration_count = User::where('created_at', '>=', Carbon::now()->subMonth(1)->startOfMonth()->format('Y-m-d'))->where('created_at', '<=', Carbon::now()->subMonth(1)->endOfMonth()->format('Y-m-d'))->where('name', 'NOT LIKE', '%test%')->count();

        $new_paying_users_yesterday = PricePlanSubscription::whereHas('user', function ($query) {
            $query->where('name', 'NOT LIKE', '%test%');
        })->with('user', 'user.lastPricePlanSubscription', 'paymentDetail', 'pricePlan')->where('created_at', '>=', Carbon::now()->subDay(1)->format('Y-m-d'))->get();
        foreach ($new_paying_users_yesterday as $user) {
            try {
                $user_total_subs = PricePlanSubscription::where('user_id', $user->user_id)->get();
                if ($user_total_subs->count() > 1) {
                    $user_collection_key = $new_paying_users_yesterday->search(function ($user_price_plan) use ($user) {
                        return $user_price_plan->user_id == $user->user_id;
                    });
                    $new_paying_users_yesterday->forget($user_collection_key);
                }
            } catch (Exception $ex) {
                info("Exception occurred!!!");
                info($ex->getMessage());
            }
        }

        $new_paying_users_yesterday_count = $new_paying_users_yesterday->count();

        $number_of_actions_count = $this->number_of_actions_count();
        $total_payments_this_month = $this->total_payments_this_month();
        $total_payments_previous_month = $this->total_payments_previous_month();
        $mmr = $this->mmr();

        $data = [
            'active_users_yesterday' => $active_users_yesterday,
            'active_users_in_30_days' => $active_users_in_30_days,
            'active_users_in_60_days' => $active_users_in_60_days,
            'active_users_in_90_days' => $active_users_in_90_days,
            'total_registration_count' => $total_registration_count,
            'yesterday_registration_count' => $yesterday_registration_count,
            'yesterday_registration_users' => $yesterday_registration_users,
            'last_week_registration_count' => $last_week_registration_count,
            'current_month_registration_count' => $current_month_registration_count,
            'previous_month_registration_count' => $previous_month_registration_count,
            'new_paying_users_yesterday' => $new_paying_users_yesterday,
            'new_paying_users_yesterday_count' => $new_paying_users_yesterday_count,
            'number_of_actions_count' => $number_of_actions_count,
            'total_payments_this_month' => $total_payments_this_month,
            'total_payments_previous_month' => $total_payments_previous_month,
            'mmr' => $mmr,
        ];

        try {
            Mail::to(
                [
                    'fernando@app2you.co.il',
                    'eric@upstartideas.com',
                    'shechter@gmail.com',
                    'galchet@gmail.com',
                    'meglash@upstartideas.com',
                    'ron@crystalball.pro',
                    'ron@crystalballinsight.com',
                    'ericdesses@gmail.com',
                    'maoz@naim.co.il'
                ]
            )->send(new DailyUserStatsMail($data));

            Mail::to(
                [
                    'goodblessnoman@gmail.com',
                    'hamzait2017@gmail.com',
                    'imhamza@outlook.com',
                ]
            )->send(new DailyUserStatsMail($data));

        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }

    }

    public function getUserActiveDevices(Request $request)
    {
        return response()->json([
            'user_active_devices_browsers' => UserActiveDevice::with('user')->where('user_id', Auth::id())->where('is_extension', false)->get(),
            'user_active_devices_extensions' => UserActiveDevice::with('user')->where('user_id', Auth::id())->where('is_extension', true)->get(),
        ]);
    }

    public function disconnectUserDevice(Request $request)
    {
        $request->validate([
            'device_id' => 'required',
        ]);
        $UserActiveDevice = UserActiveDevice::find($request->device_id);
        if ($UserActiveDevice) {
            if ($UserActiveDevice->is_extension) {
                $access_token_id = DB::table('oauth_access_tokens')->where('user_id', Auth::id())->where('id', $UserActiveDevice->access_token_id);
                if ($access_token_id->first()) {
                    $access_token_id->delete();
                }
            } else {
                $session_id = DB::table('sessions')->where('user_id', Auth::id())->where('id', $UserActiveDevice->session_id);
                if ($session_id->first()) {
                    $session_id->delete();
                }
            }
            $UserActiveDevice->delete();
        }
        return response()->json(['user_active_devices_browsers' => UserActiveDevice::with('user')->where('user_id', Auth::id())->where('is_extension', false)->get(),
            'user_active_devices_extensions' => UserActiveDevice::with('user')->where('user_id', Auth::id())->where('is_extension', true)->get(),
        ]);
    }

    public function number_of_actions_count()
    {
        $users = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('yesterdayApiAnnotationCreatedLogs')
            ->withCount('yesterdayNotificationLogs')
            ->withCount('yesterdayLoginLogs')
            ->orderBy('created_at', 'DESC')
            ->where('name', 'NOT LIKE', '%test%')
            ->get();

        $count = 0;

        foreach ($users as $user) {
            $count = $count + ($user->lastPopupOpenedChromeExtensionLog ? (int)$user->lastPopupOpenedChromeExtensionLog->count() : 0);
            $count = $count + ($user->lastAnnotationButtonClickedChromeExtensionLog ? (int)$user->lastAnnotationButtonClickedChromeExtensionLog->count() : 0);
            $count = $count + (int)$user->yesterday_api_annotation_created_logs_count;
            $count = $count + (int)$user->yesterday_notification_logs_count;
            $count = $count + (int)$user->yesterday_login_logs_count;
        }

        return $count;

    }

    public function total_payments_this_month()
    {

        $pricePlanSubscriptions = PricePlanSubscription::whereHas('user', function ($query) {
            $query->where('name', 'NOT LIKE', '%test%');
        })->where('app_sumo_invoice_item_uuid', null)->where('created_at', '>=', Carbon::now()->firstOfMonth())->get();

        $total = 0;

        foreach ($pricePlanSubscriptions as $pricePlanSubscription) {
            $total = $total + (float)$pricePlanSubscription->charged_price;
        }

        return $total;

    }

    public function total_payments_previous_month()
    {

        $pricePlanSubscriptions = PricePlanSubscription::whereHas('user', function ($query) {
            $query->where('name', 'NOT LIKE', '%test%');
        })->where('app_sumo_invoice_item_uuid', null)->where('created_at', '>=', Carbon::now()->subMonth(1)->firstOfMonth())->where('created_at', '<=', Carbon::now()->subMonth(1)->lastOfMonth())->get();

        $total = 0;

        foreach ($pricePlanSubscriptions as $pricePlanSubscription) {
            $total = $total + (float)$pricePlanSubscription->charged_price;
        }

        return $total;

    }

    public function mmr()
    {

        $pricePlanSubscriptions = PricePlanSubscription::whereHas('user', function ($query) {
            $query->where('name', 'NOT LIKE', '%test%');
        })->where('app_sumo_invoice_item_uuid', null)
            ->get();

        $total = 0;

        foreach ($pricePlanSubscriptions as $pricePlanSubscription) {
            if ($pricePlanSubscription->expires_at >= Carbon::now()) {
                if ($pricePlanSubscription->plan_duration == PricePlan::ANNUALLY) {
                    $total = $total + ((float)$pricePlanSubscription->charged_price / 12);
                } elseif ($pricePlanSubscription->plan_duration == PricePlan::MONTHLY) {
                    $total = $total + (float)$pricePlanSubscription->charged_price;
                }
            }
        }

        return round($total, 2);

    }

    public function getUniqueGoogleAnalyticsPropertiesByUser($user)
    {
        $userIdsArray = $user->getAllGroupUserIdsArray();
        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::with(['googleAccount', 'googleAnalyticsAccount']);
        $googleAnalyticsPropertiesQuery->select('id', 'name', 'google_account_id', 'google_analytics_account_id', 'was_last_data_fetching_successful', 'is_in_use')
            ->with(['googleAccount:id,name', 'googleAnalyticsAccount:id,name'])
            ->whereIn('user_id', $userIdsArray);

        $googleAnalyticsAccountIdsArray = $user->userGaAccounts->pluck('google_analytics_account_id')->toArray();
        // Check if the price plan has google analytics properties allowed
        if ($user->pricePlan->google_analytics_property_count == -1) {
            abort(402, "Please upgrade your plan to use Google Analytics Properties.");
        }

        if ($googleAnalyticsAccountIdsArray != [null] && $googleAnalyticsAccountIdsArray != []) {
            $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
            $uniqueGoogleAnalyticsProperties = collect($googleAnalyticsProperties)->unique('name')->values()->all();
            if ($user->assigned_properties_id != null) {
                $assigned_properties_ids = explode(',', $user->assigned_properties_id);
                $uniqueGoogleAnalyticsProperties = collect($uniqueGoogleAnalyticsProperties)->whereIn('id', $assigned_properties_ids)->values()->all();
            }
            return $uniqueGoogleAnalyticsProperties;
        } else {
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
            $uniqueGoogleAnalyticsProperties = collect($googleAnalyticsProperties)->unique('name')->values()->all();
            return $uniqueGoogleAnalyticsProperties;
        }
    }

}
