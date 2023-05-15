<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\GoogleAnalyticsAccount;
use App\Http\Controllers\Controller;

class GoogleAnalyticsAccountController extends Controller
{
    public function extensionIndex(Request $request)
    {

        return ['google_analytics_accounts' => array_merge(
            [
                ['id' => '*', 'name' => 'All Users'],
            ],
            GoogleAnalyticsAccount::select('google_analytics_accounts.id', 'name')->ofCurrentUser()
                ->distinct()
                ->join('annotation_ga_accounts', 'google_analytics_accounts.id', 'annotation_ga_accounts.google_analytics_account_id')
                ->get()->toArray()
        )];
    }
}
