<?php

namespace App\Http\Controllers\Spectator;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
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

        $last90DaysActiveUsers = 0;
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
                $last90DaysActiveUsers++;
                $last6MonthsActiveUsers++;
            }
        }

        $last6_months_registration_count = User::where('created_at', '>=', Carbon::now()->subMonths(6)->format('Y-m-d'))->count();
        $percent_of_active_users_in_6_months = ($last6MonthsActiveUsers  /  $last6_months_registration_count) * 100;
        $active_users_in_90_days =  $last90DaysActiveUsers;

        return view('spectator/dashboard')->with('last6_months_registration_count', $last6_months_registration_count)
            ->with('percent_of_active_users_in_6_months', $percent_of_active_users_in_6_months)
            ->with('active_users_in_90_days', $active_users_in_90_days);
    }
}
