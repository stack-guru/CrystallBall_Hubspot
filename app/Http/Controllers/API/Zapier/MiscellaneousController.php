<?php

namespace App\Http\Controllers\API\Zapier;

use App\Http\Controllers\Controller;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MiscellaneousController extends Controller
{

    public function getGoogleAnalyticsProperty(Request $request)
    {
        if (!count(Auth::user()->googleAccounts)) {
            return [];
        }

        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::ofCurrentUser()->with(['googleAccount:id,name', 'GoogleAnalyticsAccount:id,name'])->orderBy('name');

        $googleAnalyticsProperties =  $googleAnalyticsPropertiesQuery->get(['id', 'name', 'google_analytics_account_id', 'google_account_id']);

        // return ['google_analytics_properties' => $googleAnalyticsProperties];

        $resp = [];
        foreach ($googleAnalyticsProperties as $gAP) {
            array_push($resp, [
                'value' => $gAP->id,
                'label' => $gAP->name . " - " . $gAP->GoogleAnalyticsAccount->name . " - " . $gAP->GoogleAccount->name
            ]);
        }

        return $resp;
    }
}
