<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Auth;
use App\Models\GoogleSearchConsoleSite;
use App\Services\GoogleSearchConsoleService;
use App\Jobs\FetchGSCSStatisticsJob;
use Illuminate\Support\Carbon;

class GoogleSearchConsoleSiteController extends Controller
{
    public function index(Request $request)
    {
        $googleSearchConsoleSitesQuery = GoogleSearchConsoleSite::ofCurrentUser()->with('googleAccount')->orderBy('site_url');
        if ($request->has('keyword')) {
            $googleSearchConsoleSitesQuery->where('site_url', 'LIKE', '%' . $request->query('keyword') . '%');
        }

        return ['google_search_console_sites' => $googleSearchConsoleSitesQuery->get()];
    }

    public function fetch(GoogleAccount $googleAccount)
    {
        $user = Auth::user();
        if ($googleAccount->user_id !== $user->id) {
            abort(404, 'Unable to find Google Analytics account with the given id.');
        }

        $gAS = new GoogleSearchConsoleService;
        $googleSearchConsoleSites = $gAS->getSites($googleAccount);
        if ($googleSearchConsoleSites == false) {
            abort(response()->json(['message' => "Unable to fetch google search console sites."], 422));
        }

        $savedGoogleSearchConsoleSiteUrls = GoogleSearchConsoleSite::select('site_url')->ofCurrentUser()->orderBy('site_url')->get()->pluck('site_url')->toArray();

        foreach ($googleSearchConsoleSites as $index => $googleSearchConsoleSite) {
            if (!in_array($googleSearchConsoleSite['siteUrl'], $savedGoogleSearchConsoleSiteUrls)) {
                $nGSCS = new GoogleSearchConsoleSite;
                $nGSCS->site_url = $googleSearchConsoleSite['siteUrl'];
                $nGSCS->permission_level = $googleSearchConsoleSite['permissionLevel'];
                $nGSCS->google_account_id = $googleAccount->id;
                $nGSCS->user_id = $user->id;
                $nGSCS->save();
                FetchGSCSStatisticsJob::dispatch($nGSCS, '2021-01-01', Carbon::yesterday()->format('Y-m-d'));
            }
        }

        return ['success' => true];
    }

    public function destroy(GoogleSearchConsoleSite $googleSearchConsoleSite)
    {
        if (Auth::id() !== $googleSearchConsoleSite->user_id) {
            abort(404, 'Unable to find Google Search Console Site with the given id.');
        }

        $googleSearchConsoleSite->delete();
        return ['success' => true];
    }
}
