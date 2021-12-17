<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\GoogleAnalyticsMetricDimension;
use App\Models\Annotation;
use App\Models\GoogleAnalyticsProperty;
use App\Http\Controllers\Controller;

class AnalyticsController extends Controller
{

    public function deviceCategoriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('device_category, SUM(users_count) as sum_users_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count')
            ->groupBy('device_category')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function sourcesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('source_name, SUM(users_count) as sum_users_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count')
            ->groupBy('source_name')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function mediaIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('medium_name, SUM(users_count) as sum_users_count')
            ->groupBy('medium_name')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function usersDaysIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('statistics_date, SUM(users_count) as sum_users_count')
            ->groupBy('statistics_date')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->orderBy('statistics_date')
            ->get();

        return ['statistics' => $statistics];
    }

    public function usersDaysAnnotationsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'statistics_padding_days' => 'required|numeric|between:0,7',
            'ga_property_id' => 'required'
        ]);

        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $statisticsPaddingDays = $request->query('statistics_padding_days');

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404);
        }

        $user = Auth::user();

        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $statistics = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T2.description, T3.* FROM ($annotationsQuery) AS T2 RIGHT JOIN (
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL $statisticsPaddingDays DAY) as seven_day_old_date, SUM(users_count) as sum_users_count FROM google_analytics_metric_dimensions
                    WHERE ga_property_id = $gAProperty->id
                    GROUP BY statistics_date
                ) AS T3 ON T2.show_at = T3.seven_day_old_date
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate'
                ORDER BY T3.statistics_date;");

        return ['statistics' => $statistics, 'google_account' => $gAProperty->googleAccount()->first()];
    }

    public function annotationsMetricsDimensionsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'ga_property_id' => 'required'
        ]);

        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404);
        }
        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T2.description, T3.* FROM ($annotationsQuery) AS T2 INNER JOIN (
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL 7 DAY) as seven_day_old_date, SUM(users_count) as sum_users_count, SUM(sessions_count) as sum_sessions_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count  FROM google_analytics_metric_dimensions
                    WHERE ga_property_id = $gAProperty->id
                    GROUP BY statistics_date
                ) AS T3 ON T2.show_at = T3.seven_day_old_date
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate';");

        return ['annotations' => $annotations];
    }
}
