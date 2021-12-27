<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Annotation;
use Illuminate\Support\Facades\DB;

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
            ->withCount('annotationGaProperties')
            ->withCount('googleAnalyticsProperties')
            ->withCount('manualAnnotations')
            ->withCount('last90DaysLoginLogs')
            ->withCount('last90DaysApiAnnotationCreatedLogs')
            ->withCount('last90DaysPopupOpenedChromeExtensionLogs')
            ->withCount('last90DaysAnnotationButtonClickedChromeExtensionLogs')
            ->get();

        foreach ($users as $user) {
            $user->total_annotations_count = $user->getTotalAnnotationsCount(false);
        }

        return view('admin/reports/user-active-report')->with('users', $users);
    }
}
