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
            $googleAnalyticsPropertiesQuery->where('name', 'LIKE','%'. $request->query('keyword') .'%');
            $googleAnalyticsPropertiesQuery->take(10);
        }

        return ['google_analytics_properties' => $googleAnalyticsPropertiesQuery->get()];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }
}
