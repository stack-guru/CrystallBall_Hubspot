<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\GoogleSearchConsoleStatistics;
use App\Models\Annotation;
use App\Models\GoogleSearchConsoleSite;
use App\Http\Controllers\Controller;

class SearchConsoleController extends Controller
{

    public function deviceCategoriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('device_category, SUM(users_count) as sum_users_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count')
            ->groupBy('device_category')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function sourcesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('source_name, SUM(users_count) as sum_users_count, SUM(events_count) as sum_events_count, SUM(conversions_count) as sum_conversions_count')
            ->groupBy('source_name')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function mediaIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('medium_name, SUM(users_count) as sum_users_count')
            ->groupBy('medium_name')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function usersDaysIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('statistics_date, SUM(users_count) as sum_users_count')
            ->groupBy('statistics_date')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->orderBy('statistics_date')
            ->get();

        return ['statistics' => $statistics];
    }

    public function usersDaysAnnotationsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }

        $user = Auth::user();

        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('google_search_console_site_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        $statistics = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T2.description, T3.* FROM ($annotationsQuery) AS T2 RIGHT JOIN (
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL 7 DAY) as seven_day_old_date, SUM(users_count) as sum_users_count FROM google_search_console_statistics
                    WHERE google_search_console_site_id = $gSCSite->id
                    GROUP BY statistics_date
                ) AS T3 ON T2.show_at = T3.seven_day_old_date
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate'
                ORDER BY T3.statistics_date;");

        return ['statistics' => $statistics];
    }

    public function annotationsDatesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $user = Auth::user();

        $userIdsArray = $this->getAllGroupUserIdsArray();

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('google_search_console_site_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        $annotations = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T3.* FROM ($annotationsQuery) AS T2 INNER JOIN (
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL 7 DAY) as seven_day_old_date, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count FROM google_search_console_statistics
                    WHERE google_search_console_site_id = $gSCSite->id
                    GROUP BY statistics_date
                ) AS T3 ON T2.show_at = T3.seven_day_old_date
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate';");

        return ['annotations' => $annotations];
    }
}
