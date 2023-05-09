<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\GoogleAnalyticsMetricDimension;
use App\Models\Annotation;
use App\Models\GoogleAnalyticsProperty;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use App\Helpers\AnnotationQueryHelper;

class AnalyticsController extends Controller
{

    public function topStatisticsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required'
        ]);
        $gaPropertyId = $request->ga_property_id;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        return ['statistics' => DB::select("SELECT 
                SUM(users_count) AS sum_users_count,
                SUM(sessions_count) AS sum_sessions_count,
                SUM(events_count) AS sum_events_count,
                SUM(conversions_count) AS sum_conversions_count
            FROM google_analytics_metric_dimensions
            WHERE ga_property_id = $gaPropertyId
                AND statistics_date BETWEEN '$startDate' AND '$endDate'
            ;
            ")[0]];
    }

    public function usersDaysAnnotationsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
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
            abort(404, "Unable to find Google Analytics Property for the given id.");
        }

        $user = Auth::user();

        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, $request->query('ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // Apply google analytics property filter if the value for filter is provided
        if ($request->query('ga_property_id') && $request->query('ga_property_id') !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $request->query('ga_property_id') . ") ";
        }
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

        // The code below is used to add 0 values for those days which have no data
        // Google Services do not return rows for those days which have 0 value for all statistics
        $dateIndexedStatistics = [];
        foreach ($statistics as $statistic) {
            $dateIndexedStatistics[Carbon::parse($statistic->statistics_date)->format('Ymd')] = $statistic;
        }

        $filledStatistics = [];
        $daysDiffCount = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;
        for ($i = 0; $i < $daysDiffCount; $i++) {
            if (array_key_exists(Carbon::parse($startDate)->addDays($i)->format('Ymd'), $dateIndexedStatistics)) {
                $filledStatistics[] = [
                    "event_name" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->event_name,
                    "category" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->category,
                    "show_at" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->show_at,
                    "description" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->description,
                    "statistics_date" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->statistics_date,
                    "seven_day_old_date" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->seven_day_old_date,
                    "sum_users_count" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->sum_users_count,
                ];
            } else {
                $filledStatistics[] = [
                    "event_name" => null,
                    "category" => null,
                    "show_at" => null,
                    "description" => null,
                    "statistics_date" => Carbon::parse($startDate)->addDays($i)->format('Y-m-d'),
                    "seven_day_old_date" => Carbon::parse($startDate)->addDays($i)->addDays($statisticsPaddingDays)->format('Y-m-d'),
                    "sum_users_count" => "0"
                ];
            }
        }

        return ['statistics' => $filledStatistics, 'google_account' => $gAProperty->googleAccount()->first()];
    }

    public function annotationsMetricsDimensionsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'statistics_padding_days' => 'required|numeric|between:0,7',
            'ga_property_id' => 'bail | required | numeric | exists:google_analytics_properties,id'
        ]);

        // $this->authorize('viewAny', Annotation::class);
        $statisticsPaddingDays = $request->query('statistics_padding_days');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Analytics Property for the given id.");
        }
        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, $request->query('ga_property_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // Apply google analytics property filter if the value for filter is provided
        if ($request->query('ga_property_id') && $request->query('ga_property_id') !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $request->query('ga_property_id') . ") ";
        }
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        // This code block query records from google_analytics_metric dimensions table multiple times.
        // It queries records from the table and substracts number of days from the statistics_date col
        // to move data from different days on same date.
        // If the user say selected 3 padding days then, for example, this code will read records of date 8 feb as 8 feb,
        // 9 feb as 8 feb  and 10 feb as 8 feb. After that it groups all the values using SUM function
        // THIS LOGIC IS BULKY AND PUT QUITE MUCH LOAD ON THE SYSTEM. SOMEONE HAS TO ACHIEVE IT IN THE FISRT PLACE
        // I HAVE ACHIEVED IT. IF YOU WANT TO IMRPOVE IT. FEEL FREE TO CHANGE THE CODE AND TRY YOUR LOGIC HERE
        $statisticsQuery = "SELECT statistics_date, SUM(sum_users_count) as sum_users_count, SUM(sum_sessions_count) as sum_sessions_count, SUM(sum_events_count) as sum_events_count, SUM(sum_conversions_count) as sum_conversions_count  FROM (";
        // This loop is used to read records multiple times based on user selected padding days
        // This loop should run atleast once to keep the SQL syntax correct
        for ($i = 0; ($i < $statisticsPaddingDays) || ($i == 0); $i++) {
            if ($i > 0) $statisticsQuery .= " UNION ALL ";
            $statisticsQuery .= "SELECT DATE_SUB(statistics_date, INTERVAL $i DAY) AS statistics_date, SUM(users_count) as sum_users_count, SUM(sessions_count) as sum_sessions_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count  FROM google_analytics_metric_dimensions
                WHERE ga_property_id = $gAProperty->id
                GROUP BY statistics_date";
        }
        $statisticsQuery .= ") AS T4
        GROUP BY statistics_date";

        // If you are here to diagnose an error in this SQL then a better way to diagnose this SQL
        // is to extract the actual executing SQL statement in a separate place and run trial there
        // once you are done with it, you can make changes here.
        $annotations = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T2.description, T3.*
                FROM ($annotationsQuery) AS T2
                INNER JOIN (
                    $statisticsQuery
                ) AS T3 ON T2.show_at = T3.statistics_date
                WHERE T2.show_at BETWEEN '$startDate' AND '$endDate';");

        return ['annotations' => $annotations];
    }

    public function mediaIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Analytics Property for the given id.");
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('medium_name, SUM(users_count) as sum_users_count')
            ->groupBy('medium_name')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function sourcesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Analytics Property for the given id.");
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('source_name, SUM(users_count) as sum_users_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count')
            ->groupBy('source_name')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->orderBy('sum_users_count', 'DESC')
            ->get();

        return ['statistics' => $statistics];
    }

    public function deviceCategoriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Analytics Property for the given id.");
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('device_category, SUM(users_count) as sum_users_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count')
            ->groupBy('device_category')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function usersDaysIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Analytics Property for the given id.");
        }
        $statistics = GoogleAnalyticsMetricDimension::selectRaw('statistics_date, SUM(users_count) as sum_users_count')
            ->groupBy('statistics_date')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('ga_property_id', $gAProperty->id)
            ->orderBy('statistics_date')
            ->get();

        return ['statistics' => $statistics];
    }
}
