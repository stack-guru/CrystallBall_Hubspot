<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Requests\UserRequest;
use App\Mail\DailyUserStatsMail;
use App\Mail\UserInviteMail;
use App\Models\PricePlanSubscription;
use App\Models\User;
use App\Models\UserGaAccount;
use Carbon\Carbon;
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
        $users = $user->user_id ? $user->user->users : $user->users;

        return ['users' => $users];
    }

    public function show(User $user)
    {

        $this->authorize('view', $user);

        if ($user->user_id !== Auth::id()) {
            abort(404, "Unable to find user with the given id.");
        }

        $user->load('userGaAccounts');
        return ['user' => $user];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
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
        } else if (count($parentUser->users) >= $parentUser->pricePlan->user_per_ga_account_count) {
            return response()->json([
                'message' => 'Your limit has been reached.'
            ], 455);
        }

        $user = new User;
        $user->fill($request->validated());
        $user->password = Hash::make($request->password);
        $user->user_id = $parentUser->id;
        $user->price_plan_id = $parentUser->price_plan_id;
        $user->price_plan_expiry_date = $parentUser->price_plan_expiry_date;
        $user->save();

        Mail::to($user)->send(new UserInviteMail($user, $request->password));

        if ($request->google_analytics_account_id !== null && !in_array("", $request->google_analytics_account_id)) {
            foreach ($request->google_analytics_account_id as $gAAId) {
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

        event(new \App\Events\UserInvitedTeamMember($parentUser));
        return ['user' => $user];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
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
        $user->price_plan_id = $user->price_plan_id;
        $user->price_plan_expiry_date = $user->price_plan_expiry_date;
        $user->save();

        $uGAAs = $user->userGaAccounts;
        $oldGAAIds = $uGAAs->pluck('google_analytics_account_id')->toArray();
        $newGAAIds = $request->google_analytics_account_id;

        foreach ($uGAAs as $uGAA) {
            if (!in_array($uGAA->google_analytics_account_id, $newGAAIds)) {
                $uGAA->delete();
            }
        }

        if ($request->has('google_analytics_account_id')) {
            if ($request->google_analytics_account_id !== null && !in_array("", $request->google_analytics_account_id)) {
                foreach ($newGAAIds as $gAAId) {
                    if (!in_array($gAAId, $oldGAAIds)) {
                        $uGAA = new UserGaAccount;
                        $uGAA->user_id = $user->id;
                        $uGAA->google_analytics_account_id = $gAAId;
                        $uGAA->save();
                    }
                }
            } else {
                if (!in_array("", $oldGAAIds)) {
                    $uGAA = new UserGaAccount;
                    $uGAA->user_id = $user->id;
                    $uGAA->google_analytics_account_id = null;
                    $uGAA->save();
                }
            }
        }

        return ['user' => $user];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return ['success' => true];
    }

    public function getTeamName()
    {
        return ['team_names' => DB::table('users')->where('user_id', Auth::id())->whereNotNull('team_name')->select('team_name')->distinct()->get()];
    }

    public function sendEmailWithUserStatsToAdmin()
    {
        $users  = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('last90DaysApiAnnotationCreatedLogs')
            ->withCount('last90DaysNotificationLogs')
            ->withCount('last90DaysLoginLogs')
            ->orderBy('created_at', 'DESC')->get();

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

        $active_users_yesterday =  (new DashboardController())->active_users_yesterday();
        $active_users_in_30_days =  (new DashboardController())->active_users_in_30_days();
        $active_users_in_60_days =  (new DashboardController())->active_users_in_60_days();

        $total_registration_count = User::count();
        $yesterday_registration_count = User::where('created_at', '>=', Carbon::now()->subDay(1)->format('Y-m-d'))->count();
        $yesterday_registration_users = User::where('created_at', '>=', Carbon::now()->subDay(1)->format('Y-m-d'))->get()->pluck('name', 'email')->toArray();
        $last_week_registration_count = User::where('created_at', '>=', Carbon::now()->subDay(7)->format('Y-m-d'))->count();
        $current_month_registration_count = User::where('created_at', '>=', Carbon::now()->startOfMonth()->format('Y-m-d'))->count();
        $previous_month_registration_count = User::where('created_at', '>=', Carbon::now()->subMonth(1)->startOfMonth()->format('Y-m-d'))->where('created_at', '<=', Carbon::now()->subMonth(1)->endOfMonth()->format('Y-m-d'))->count();
        
        $new_paying_users_yesterday = PricePlanSubscription::with('user', 'user.lastPricePlanSubscription', 'paymentDetail', 'pricePlan')->where('created_at', '>=', Carbon::now()->subDay(1)->format('Y-m-d'))->get();
        $new_paying_users_yesterday_count = $new_paying_users_yesterday->count();

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
        ];

        Log::alert($data);

        try {
            Mail::to('fernando@app2you.co.il')->send(new DailyUserStatsMail($data));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }
        
    }

}
