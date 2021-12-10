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

    public function clicksImpressionsDaysAnnotationsIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $this->authorize('viewAny', Annotation::class);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $userIdsArray = $this->getAllGroupUserIdsArray(Auth::user());

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
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL 7 DAY) as seven_day_old_date, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count FROM google_search_console_statistics
                    WHERE google_search_console_site_id = $gSCSite->id
                    GROUP BY statistics_date
                ) AS T3 ON T2.show_at = T3.seven_day_old_date
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate'
                ORDER BY T3.statistics_date;");

        return ['statistics' => $statistics];
    }

    public function queriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray(Auth::user());

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('query, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('query')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->orderBy('query')
            ->get();

        return ['statistics' => $statistics, 'google_account' => $gSCSite->googleAccount()->first()];
    }

    public function pagesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray(Auth::user());

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('page, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('page')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function countriesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray(Auth::user());

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('country, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('country')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

        return ['statistics' => $statistics];
    }

    public function devicesIndex(Request $request)
    {
        $this->validate($request, [
            'start_date' => 'required|date|after:2005-01-01|before:today|before:end_date',
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray(Auth::user());

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
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
            'end_date' => 'required|date|after:2005-01-01|after:start_date|before:tomorrow',
            'google_search_console_site_id' => 'required'
        ]);

        $userIdsArray = $this->getAllGroupUserIdsArray(Auth::user());

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $statistics = GoogleSearchConsoleStatistics::selectRaw('search_appearance, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count')
            ->groupBy('search_appearance')
            ->whereBetween('statistics_date', [$request->query('start_date'), $request->query('end_date')])
            ->where('google_search_console_site_id', $gSCSite->id)
            ->get();

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
        $userIdsArray = $this->getAllGroupUserIdsArray($user);

        $gSCSite = GoogleSearchConsoleSite::findOrFail($request->query('google_search_console_site_id'));
        if (!in_array($gSCSite->user_id, $userIdsArray)) {
            abort(404);
        }
        $annotationsQuery = "SELECT `TempTable`.* FROM (";
        $annotationsQuery .= Annotation::allAnnotationsUnionQueryString($user, $request->query('google_search_console_site_id'), $userIdsArray);
        $annotationsQuery .= ") AS TempTable";
        $annotationsQuery .= " ORDER BY TempTable.show_at DESC";

        $annotations = DB::select("SELECT T2.event_name, T2.category, T2.show_at, T2.description, T3.* FROM ($annotationsQuery) AS T2 INNER JOIN (
                    SELECT statistics_date, DATE_SUB(statistics_date, INTERVAL 7 DAY) as seven_day_old_date, SUM(clicks_count) as sum_clicks_count, SUM(impressions_count) as sum_impressions_count FROM google_search_console_statistics
                    WHERE google_search_console_site_id = $gSCSite->id
                    GROUP BY statistics_date
                ) AS T3 ON T2.show_at = T3.seven_day_old_date
                WHERE T3.statistics_date BETWEEN '$startDate' AND '$endDate';");

        return ['annotations' => $annotations];
    }
}
