<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Carbon;

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

        $active_users_in_60_days =  $this->active_users_in_60_days();
        $active_users_in_30_days =  $this->active_users_in_30_days();
        $active_users_of_all_time =  $this->active_users_of_all_time();

        $last6_months_registration_count = User::where('created_at', '>=', Carbon::now()->subMonths(6)->format('Y-m-d'))->count();
        $percent_of_active_users_in_6_months = ($last6MonthsActiveUsers  /  $last6_months_registration_count) * 100;
        $active_users_in_90_days =  $last90DaysActiveUsers;

        return view('admin/dashboard')->with('last6_months_registration_count', $last6_months_registration_count)
            ->with('percent_of_active_users_in_6_months', $percent_of_active_users_in_6_months)
            ->with('active_users_in_90_days', $active_users_in_90_days)
            ->with('active_users_in_60_days', $active_users_in_60_days)
            ->with('active_users_in_30_days', $active_users_in_30_days)
            ->with('active_users_of_all_time', $active_users_of_all_time);
    }

    public function active_users_in_60_days()
    {
        $users  = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('last60DaysApiAnnotationCreatedLogs')
            ->withCount('last60DaysNotificationLogs')
            ->withCount('last60DaysLoginLogs')
            ->orderBy('created_at', 'DESC')
            ->where('name','NOT LIKE','%test%')
            ->get();

        $last60DaysActiveUsers = 0;

        foreach ($users as $user) {
            if (
                $user->last60_days_popup_opened_chrome_extension_logs_count
                || $user->last60_days_annotation_button_clicked_chrome_extension_logs_count
                || $user->last60_days_api_annotation_created_logs_count
                || $user->last60_days_notification_logs_count
                || @$user->pricePlan->price
                || $user->last60_days_login_logs_count
            ) {
                $last60DaysActiveUsers++;
            }
        }
        return $last60DaysActiveUsers;
    }

    public function active_users_in_30_days()
    {
        $users  = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('last30DaysApiAnnotationCreatedLogs')
            ->withCount('last30DaysNotificationLogs')
            ->withCount('last30DaysLoginLogs')
            ->orderBy('created_at', 'DESC')
            ->where('name','NOT LIKE','%test%')
            ->get();

        $last30DaysActiveUsers = 0;

        foreach ($users as $user) {
            if (
                $user->last30_days_popup_opened_chrome_extension_logs_count
                || $user->last30_days_annotation_button_clicked_chrome_extension_logs_count
                || $user->last30_days_api_annotation_created_logs_count
                || $user->last30_days_notification_logs_count
                || @$user->pricePlan->price
                || $user->last30_days_login_logs_count
            ) {
                $last30DaysActiveUsers++;
            }
        }
        return $last30DaysActiveUsers;
    }

    private function active_users_of_all_time()
    {
        $users  = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('allTimeApiAnnotationCreatedLogs')
            ->withCount('allTimeNotificationLogs')
            ->withCount('allTimeLoginLogs')
            ->orderBy('created_at', 'DESC')->get();

        $allTimeActiveUsers = 0;

        foreach ($users as $user) {
            if (
                $user->all_time_popup_opened_chrome_extension_logs_count
                || $user->all_time_annotation_button_clicked_chrome_extension_logs_count
                || $user->all_time_api_annotation_created_logs_count
                || $user->all_time_notification_logs_count
                || @$user->pricePlan->price
                || $user->all_time_login_logs_count
            ) {
                $allTimeActiveUsers++;
            }
        }
        return $allTimeActiveUsers;
    }

    public function active_users_yesterday()
    {
        $users  = User::with([
            'pricePlan',
            'lastPopupOpenedChromeExtensionLog',
            'lastAnnotationButtonClickedChromeExtensionLog',
        ])
            ->withCount('yesterdayApiAnnotationCreatedLogs')
            ->withCount('yesterdayNotificationLogs')
            ->withCount('yesterdayLoginLogs')
            ->orderBy('created_at', 'DESC')
            ->where('name','NOT LIKE','%test%')
            ->get();

        $yesterdayActiveUsers = 0;

        foreach ($users as $user) {
            if (
                $user->yesterday_popup_opened_chrome_extension_logs_count
                || $user->yesterday_annotation_button_clicked_chrome_extension_logs_count
                || $user->yesterday_api_annotation_created_logs_count
                || $user->yesterday_notification_logs_count
                || @$user->pricePlan->price
                || $user->yesterday_login_logs_count
            ) {
                $yesterdayActiveUsers++;
            }
        }
        return $yesterdayActiveUsers;
    }

}
