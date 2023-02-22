<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Annotation;
use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Helpers\AnnotationQueryHelper;

class ReportsController extends Controller
{
    public function showUserActiveReport(Request $request)
    {
        $users = User::orderBy('created_at', 'DESC')
            ->with([
                'user',
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
            ->withCount('users')
            ->get();

        foreach ($users as $user) {
            $user->total_annotations_count = $user->getTotalAnnotationsCount(false);
        }

        return view('admin/reports/user-active-report')->with('users', $users);
    }

    public function showUserGAInfo(Request $request, User $user)
    {
        $userIdsArray = $user->getAllGroupUserIdsArray();

        if (!GoogleAccount::whereIn('user_id', $userIdsArray)->count()) {
            abort(400, "Please connect Google Analytics account before you use Google Analytics Properties.");
        }

        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::with(['googleAccount', 'googleAnalyticsAccount'])->orderBy('name');
        $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->where('google_analytics_properties.user_id', $user->id)->get();

        return view('admin.reports.user-ga-info', compact('user', 'googleAnalyticsProperties'));
    }

    public function userAnnotationListForReport(Request $request)
    {
        $user = User::find($request->user_id);
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT `TempTable`.*, `annotation_ga_properties`.`google_analytics_property_id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, '*', $userIdsArray, '*', true);
        $annotationsQuery .= ") AS TempTable";

        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // LEFT JOINs to load all property details which are loaded from above statement
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";

        // Apply category filter if it is added in GET request query parameter
        if ($request->query('category') && $request->query('category') !== '') {
            $annotationsQuery .= " WHERE category = '" . $request->query('category') . "'";
        }
        // Apply google analytics property filter if the value for filter is provided
        if ($request->query('annotation_ga_property_id') && $request->query('annotation_ga_property_id') !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $request->query('annotation_ga_property_id') . ") ";
        }

        // Apply sort of provided column if it is added in GET request query parameter
        if ($request->query('sortBy') == "added") {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sortBy') == "date") {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        } elseif ($request->query('google_account_id')) {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sortBy') == "category") {
            $annotationsQuery .= " ORDER BY TempTable.category ASC";
        } elseif ($request->query('sortBy') == "added-by") {
            $annotationsQuery .= " ORDER BY TempTable.added_by ASC";
        } else {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        }
        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        $html = view('admin.reports.user-annotation-list', compact('annotations', 'user'))->render();

        return ['html' => $html];
    }

    public function userAnnotationListForReportUpdateView(Request $request)
    {
        $user = User::find($request->user_id);
        if ($user) {
            $user->last_screenshot_of_report_at = now();
            $user->save();
        }
    }
}
