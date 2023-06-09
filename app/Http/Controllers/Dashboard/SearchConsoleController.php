<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\GoogleSearchConsoleStatistics;
use App\Models\Annotation;
use App\Models\GoogleSearchConsoleSite;
use App\Http\Controllers\Controller;
use App\Helpers\AnnotationQueryHelper;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Support\Carbon;

class SearchConsoleController extends Controller
{

    public function topStatisticsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required'
            // 'google_search_console_site_id' => 'bail|required|numeric|exists:google_search_console_sites,id',
        ]);
        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray) || !$gAProperty->google_search_console_site_id) {
            $statistics[] = [
                "sum_clicks_count" => "∞",
                "sum_impressions_count" => "∞",
                "max_ctr_count" => "∞",
                "min_position_rank" => "∞",
            ];
            return ['statistics' => $statistics];
        }
        // abort(404, "Unable to find Google Search Console Site for the given id.");

        $gSCSiteId = $gAProperty->google_search_console_site_id;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        return ['statistics' => DB::select("SELECT 
                SUM(clicks_count) AS sum_clicks_count,
                SUM(impressions_count) AS sum_impressions_count,
                MAX(ctr_count) AS max_ctr_count,
                MIN(position_rank) AS min_position_rank
            FROM google_search_console_statistics
            WHERE google_search_console_site_id = $gSCSiteId
                AND statistics_date BETWEEN '$startDate' AND '$endDate'
            ;
            ")[0]];
    }

    public function clicksImpressionsDaysAnnotationsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required',
            'statistics_padding_days' => 'required|numeric|between:0,7',
        ]);

        
        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $statisticsPaddingDays = $request->query('statistics_padding_days');

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();
        
        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray) || !$gAProperty->google_search_console_site_id) {
            $filledStatistics[] = [
                "event_name" => null,
                "category" => null,
                "show_at" => null,
                "description" => null,
                "statistics_date" => null,
                "seven_day_old_date" => null,
                "sum_clicks_count" => "0",
                "sum_impressions_count" => "0"
            ];
            return ['statistics' => $filledStatistics];
        }
        $gSCSiteId = $gAProperty->google_search_console_site_id;
        $gSCSite = GoogleSearchConsoleSite::findOrFail($gSCSiteId);
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            return ['statistics' => []];
        }
        $user = Auth::user();

        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, $gSCSiteId, $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // Apply google analytics property filter if the value for filter is provided
        if ($gSCSiteId && $gSCSiteId !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $gSCSiteId . ") ";
        }
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $statistics = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T2.description, T3.* FROM ($annotationsQuery) AS T2 RIGHT JOIN (
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL $statisticsPaddingDays DAY) as seven_day_old_date, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count FROM google_search_console_statistics
                    WHERE google_search_console_site_id = $gSCSite->id
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
                    "sum_clicks_count" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->sum_clicks_count,
                    "sum_impressions_count" => $dateIndexedStatistics[Carbon::parse($startDate)->addDays($i)->format('Ymd')]->sum_impressions_count,
                ];
            } else {
                $filledStatistics[] = [
                    "event_name" => null,
                    "category" => null,
                    "show_at" => null,
                    "description" => null,
                    "statistics_date" => Carbon::parse($startDate)->addDays($i)->format('Y-m-d'),
                    "seven_day_old_date" => Carbon::parse($startDate)->addDays($i)->addDays(7)->format('Y-m-d'),
                    "sum_clicks_count" => "0",
                    "sum_impressions_count" => "0"
                ];
            }
        }

        return ['statistics' => $filledStatistics];
    }

    public function annotationsDatesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required',
            'statistics_padding_days' => 'required|numeric|between:0,7',
        ]);

        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $statisticsPaddingDays = $request->query('statistics_padding_days');

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();
        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray) || !$gAProperty->google_search_console_site_id) {
            return ['annotations' => []];
        }
        $gSCSite = GoogleSearchConsoleSite::findOrFail($gAProperty->google_search_console_site_id);
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            return ['annotations' => []];
        }
        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= AnnotationQueryHelper::allAnnotationsUnionQueryString($user, $gAProperty->google_search_console_site_id, $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        // LEFT JOIN to load all properties selected in annotations
        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        // Apply google analytics property filter if the value for filter is provided
        if ($gAProperty->google_search_console_site_id && $gAProperty->google_search_console_site_id !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $gAProperty->google_search_console_site_id . ") ";
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
        $statisticsQuery = "SELECT statistics_date,  SUM(sum_clicks_count) as sum_clicks_count, SUM(sum_impressions_count) as sum_impressions_count FROM (";
        // This loop is used to read records multiple times based on user selected padding days
        // This loop should run atleast once to keep the SQL syntax correct
        for ($i = 0; ($i < $statisticsPaddingDays) || ($i == 0); $i++) {
            if ($i > 0) $statisticsQuery .= " UNION ALL ";
            $statisticsQuery .= "SELECT statistics_date,  SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count FROM google_search_console_statistics
                WHERE google_search_console_site_id = $gSCSite->id
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
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate';");

        return ['annotations' => $annotations];
    }

    public function queriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required',
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray) || !$gAProperty->google_search_console_site_id) {
            return ['statistics' => [],'google_account'=> []];
        }
        $gSCSite = GoogleSearchConsoleSite::findOrFail($gAProperty->google_search_console_site_id);
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            return ['statistics' => [],'google_account'=> []];
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('query, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('query')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->orderBy('sum_clicks_count', 'DESC')
            ->get();

        return ['statistics' => $statistics, 'google_account' => $gSCSite->googleAccount()->first()];
    }

    public function pagesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'ga_property_id' => 'required',
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();
        $gAProperty = GoogleAnalyticsProperty::findOrFail($request->query('ga_property_id'));
        if (!in_array($gAProperty->user_id, $userIdsArray) || !$gAProperty->google_search_console_site_id) {
            return ['statistics' => []];
        }
        $gSCSite = GoogleSearchConsoleSite::findOrFail($gAProperty->google_search_console_site_id);
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            return ['statistics' => []];
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('page, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('page')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->orderBy('sum_clicks_count', 'DESC')
            ->get();

        return ['statistics' => $statistics];
    }

    public function countriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Search Console Site for the given id.");
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('country, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('country')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->orderBy('sum_clicks_count', 'DESC')
            ->get();

        return ['statistics' => $statistics];
    }

    public function devicesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Search Console Site for the given id.");
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('device, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('device')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function searchAppearancesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = (Auth::user())->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404, "Unable to find Google Search Console Site for the given id.");
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('search_appearance, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('search_appearance')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }
}
