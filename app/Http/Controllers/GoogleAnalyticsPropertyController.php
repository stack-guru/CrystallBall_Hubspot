<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoogleAnalyticsPropertyController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        if (!GoogleAccount::whereIn('user_id', $userIdsArray)->count()) {
            abort(400, "Please connect Google Analytics account before you use Google Analytics Properties.");
        }

        $uniqueGoogleAnalyticsProperties = this->getUniqueGoogleAnalyticsPropertiesByUser($user);
        return ['google_analytics_properties' => $uniqueGoogleAnalyticsProperties];
    }

    public function update(Request $request, GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $this->validate($request, [
            'google_search_console_site_id' => 'bail|required|numeric|exists:google_search_console_sites,id'
        ]);

        if (Auth::id() !== $googleAnalyticsProperty->user_id) {
            abort(404, 'Unable to find referenced Google Analytics Property.');
        }

        if ($request->has('google_search_console_site_id')) $googleAnalyticsProperty->google_search_console_site_id = $request->google_search_console_site_id;
        $googleAnalyticsProperty->save();

        $googleAnalyticsProperty->load('googleAccount');
        // $googleAnalyticsProperty->load('googleAnalyticsAccount');
        return ['google_analytics_property' => $googleAnalyticsProperty];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }

    public function getUniqueGoogleAnalyticsPropertiesByUser($user)
    {
        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::with(['googleAccount', 'googleAnalyticsAccount'])
            ->select('id', 'name', 'google_account_id', 'google_analytics_account_id', 'was_last_data_fetching_successful', 'is_in_use')
            ->with(['googleAccount:id,name', 'googleAnalyticsAccount:id,name'])
            ->whereIn('user_id', [$user->user_id]);

        $googleAnalyticsAccountIdsArray = $user->userGaAccounts->pluck('google_analytics_account_id')->toArray();
        if ($googleAnalyticsAccountIdsArray != [null] && $googleAnalyticsAccountIdsArray != []) {
            $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
            $uniqueGoogleAnalyticsProperties = collect($googleAnalyticsProperties)->unique('name')->values()->all();
            if ($user->assigned_properties_id != null) {
                $assigned_properties_ids = explode(',', $user->assigned_properties_id);
                $uniqueGoogleAnalyticsProperties = collect($uniqueGoogleAnalyticsProperties)->whereIn('id', $assigned_properties_ids)->values()->all();
            }
            return $uniqueGoogleAnalyticsProperties;
        }

        return [];
    }
}
