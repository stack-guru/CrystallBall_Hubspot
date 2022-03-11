<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoogleAnalyticsPropertyController extends Controller
{
    public function index(Request $request)
    {
        if (!count(Auth::user()->googleAccounts)) {
            abort(400, "Please connect Google Analytics account before you use Google Analytics Properties.");
        }

        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::ofCurrentUser()->with(['googleAccount', 'GoogleAnalyticsAccount'])->orderBy('name');
        if ($request->has('keyword')) {
            $googleAnalyticsPropertiesQuery->where('name', 'LIKE', '%' . $request->query('keyword') . '%');
        }

        return ['google_analytics_properties' => $googleAnalyticsPropertiesQuery->get()];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }
}
