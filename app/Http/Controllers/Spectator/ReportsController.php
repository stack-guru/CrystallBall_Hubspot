<?php

namespace App\Http\Controllers\Spectator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ReportsController extends Controller
{
    public function showUserActiveReport(Request $request)
    {
        $users = User::orderBy('created_at', 'DESC')
            ->with([
                'pricePlan',
                'googleAccounts',
                'lastAnnotation',
                'lastPopupOpenedChromeExtensionLog',
                'lastAnnotationButtonClickedChromeExtensionLog',
            ])
            ->withCount('loginLogs')
            ->withCount('annotationButtonClickedChromeExtensionLogs')
            ->withCount('annotationGaProperties')
            ->withCount('googleAnalyticsProperties')
            ->withCount('googleAnalyticsPropertiesInUse')
            ->withCount('manualAnnotations')
            ->withCount('last90DaysLoginLogs')
            ->withCount('last90DaysApiAnnotationCreatedLogs')
            ->withCount('last90DaysPopupOpenedChromeExtensionLogs')
            ->withCount('last90DaysAnnotationButtonClickedChromeExtensionLogs')
            ->withCount('last90DaysNotificationLogs')
            ->withCount('emailNotificationLogs')
            ->get();

        foreach ($users as $user) {
            $user->total_annotations_count = $user->getTotalAnnotationsCount(false);
        }

        return view('spectator/reports/user-active-report')->with('users', $users);
    }
}
