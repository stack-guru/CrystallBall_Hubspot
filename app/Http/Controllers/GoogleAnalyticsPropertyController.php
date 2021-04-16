<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;
use Illuminate\Http\Request;

class GoogleAnalyticsPropertyController extends Controller
{
    public function index(Request $request)
    {
        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::ofCurrentUser()->with(['googleAccount', 'GoogleAnalyticsAccount'])->orderBy('name');
        if($request->has('keyword')){
            $googleAnalyticsPropertiesQuery->where('name', 'like','%'. $request->has('keyword') .'%')->take(10);
        }

        return ['google_analytics_properties' => $googleAnalyticsPropertiesQuery->get()];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        return ['success' => true];
    }
}
