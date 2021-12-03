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
            ->with('lastAnnotation')
            ->withCount('googleAnalyticsProperties')
            ->withCount('manualAnnotations')
            ->withCount('loginLogs')
            ->get();

        foreach ($users as $user) {
            $userIdsArray = $this->getAllGroupUserIdsArray($user);
            $annotationsQuery = "SELECT COUNT(*) AS total_annotations_count FROM (";
            $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, '*', $userIdsArray);
            $annotationsQuery .= ") AS TempTable";

            $user->total_annotations_count = DB::select($annotationsQuery)[0]->total_annotations_count;
        }

        return view('admin/reports/user-activity-report')->with('users', $users);
    }
}
