<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ReportsController extends Controller
{
    public function showUserActiveReport(Request $request)
    {
        $users = User::with(['pricePlan', 'lastAnnotation', 'lastAnnotationButtonClickedChromeExtensionLog', 'lastPopupOpenedChromeExtensionLog'])
            ->orderBy('created_at', 'DESC')
            ->withCount('loginLogs')
            ->withCount('last30DaysApiAnnotationCreatedLogs')
            ->withCount('last30DaysPopupOpenedChromeExtensionLogs')
            ->withCount('AnnotationButtonClickedChromeExtensionLogs')
            ->get();

        return view('admin/reports/user-active-report')->with('users', $users);
    }

    public function showUserActivityReport(Request $request)
    {
        $users = User::orderBy('created_at', 'DESC')
            ->with('googleAccounts')
            ->withCount('googleAnalyticsProperties')
            ->withCount('last30DaysApiAnnotationCreatedLogs')
            ->withCount('last30DaysPopupOpenedChromeExtensionLogs')
            ->withCount('AnnotationButtonClickedChromeExtensionLogs')
            ->get();

        return view('admin/reports/user-active-report')->with('users', $users);
    }
}
