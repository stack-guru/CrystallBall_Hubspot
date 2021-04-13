<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;

class GoogleAnalyticsPropertyController extends Controller
{
    public function index()
    {
        $googleAnalyticsProperties = GoogleAnalyticsProperty::ofCurrentUser()->with(['googleAccount', 'GoogleAnalyticsAccount'])->orderBy('name')->get();

        return ['google_analytics_properties' => $googleAnalyticsProperties];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        return ['success' => true];
    }
}
