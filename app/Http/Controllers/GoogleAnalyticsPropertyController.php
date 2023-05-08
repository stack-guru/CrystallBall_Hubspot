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
        $uniqueGoogleAnalyticsProperties = \App\Http\Controllers\API\UserController::getUniqueGoogleAnalyticsPropertiesByUser($user);
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
}
