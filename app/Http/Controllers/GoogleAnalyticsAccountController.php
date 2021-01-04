<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use App\Services\GoogleAnalyticsService;
use Auth;

class GoogleAnalyticsAccountController extends Controller
{
    public function index()
    {
        return ['google_analytics_accounts' => GoogleAnalyticsAccount::ofCurrentUser()->with('googleAccount')->orderBy('name')->get()];
    }

    public function fetch(GoogleAccount $googleAccount)
    {
        if ($googleAccount->user_id !== Auth::id()) {
            abort(404);
        }

        $gAS = new GoogleAnalyticsService;
        $googleAnalyticsAccounts = $gAS->getConnectedAccounts($googleAccount);
        if ($googleAnalyticsAccounts == false) {
            abort(response()->json(['message' => "Unable to fetch google analytics accounts."], 422));
        }

        $savedGoogleAnalyticAccountIds = GoogleAnalyticsAccount::select('ga_id')->ofCurrentUser()->orderBy('ga_id')->get()->pluck('ga_id')->toArray();

        foreach ($googleAnalyticsAccounts as $index => $googleAnalyticsAccount) {
            if (!in_array($googleAnalyticsAccount['id'], $savedGoogleAnalyticAccountIds)) {
                $nGAA = new GoogleAnalyticsAccount;
                $nGAA->ga_id = $googleAnalyticsAccount['id'];
                $nGAA->name = $googleAnalyticsAccount['name'];
                $nGAA->self_link = $googleAnalyticsAccount['selfLink'];
                $nGAA->permissions = json_encode($googleAnalyticsAccount['permissions']);
                $nGAA->ga_created = new \DateTime($googleAnalyticsAccount['created']);
                $nGAA->ga_updated = new \DateTime($googleAnalyticsAccount['updated']);
                $nGAA->property_type = $googleAnalyticsAccount['childLink']['type'];
                $nGAA->property_href = $googleAnalyticsAccount['childLink']['href'];
                $nGAA->google_account_id = $googleAccount->id;
                $nGAA->user_id = Auth::id();
                $nGAA->save();
            }
        }

        return ['success' => true];
    }

    public function destroy(GoogleAnalyticsAccount $googleAnalyticsAccount)
    {
        if (Auth::id() !== $googleAnalyticsAccount->user_id) {
            abort(404);
        }

        $googleAnalyticsAccount->delete();
        return ['success' => true];
    }
}
