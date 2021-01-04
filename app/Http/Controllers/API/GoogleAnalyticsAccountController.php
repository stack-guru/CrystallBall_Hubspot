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
                ['id' => '*', 'name' => 'No Filter'],
            ],
            GoogleAnalyticsAccount::ofCurrentUser()->get()->toArray()
        )];
    }
}
