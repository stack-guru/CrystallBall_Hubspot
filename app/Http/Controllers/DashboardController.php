<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\GoogleAnalyticsMetricDimension;
use App\Models\Annotation;

class DashboardController extends Controller
{

    public function deviceCategoriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
        ]);

        $statistics = GoogleAnalyticsMetricDimension::selectRaw('device_category, SUM(users_count) as sum_users_count')->groupBy('device_category')->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])->get();

        return ['statistics' => $statistics];
    }

    public function sourcesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
        ]);

        $statistics = GoogleAnalyticsMetricDimension::selectRaw('source_name, SUM(users_count) as sum_users_count')->groupBy('source_name')->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])->get();

        return ['statistics' => $statistics];
    }

    public function mediumsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
        ]);

        $statistics = GoogleAnalyticsMetricDimension::selectRaw('medium_name, SUM(users_count) as sum_users_count')->groupBy('medium_name')->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])->get();

        return ['statistics' => $statistics];
    }

    public function usersDaysIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
        ]);

        $statistics = GoogleAnalyticsMetricDimension::selectRaw('statistics_date, SUM(users_count) as sum_users_count')->groupBy('statistics_date')->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])->get();

        return ['statistics' => $statistics];
    }

    public function annotationsMetricsDimensionsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
        ]);

        $this->authorize('viewAny', Annotation::class);

        $user = Auth::user();
        $userIdsArray = [];

        if (!$user->user_id) {
            // Current user is not child, grab all child users, pluck ids
            $userIdsArray = $user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->id);
        } else {
            // Current user is child, find admin, grab all child users, pluck ids
            $userIdsArray = $user->user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->user->id);
            // Set Current User to Admin so that data source configuration which applies are that of admin
            $user = $user->user;
        }

        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('annotation_ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        $annotations = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T3.* FROM ($annotationsQuery) AS T2 INNER JOIN (
            SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL 7 DAY) as seven_day_old_date, SUM(sessions_count) as sum_sessions_count, SUM(events_count) as sum_events_count  FROM google_analytics_metric_dimensions
            GROUP BY statistics_date
        ) AS T3 ON T2.show_at = T3.seven_day_old_date;");

        return ['annotations' => $annotations];
    }
}
