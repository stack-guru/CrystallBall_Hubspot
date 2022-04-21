<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use App\Services\GoogleAdsService;
use Illuminate\Http\Request;

class GoogleAdsAccountController extends Controller
{
    public function uiIndex(Request $request)
    {
        $this->validate($request, [
            'google_account_id' => 'bail|required|numeric|exists:google_accounts,id'
        ]);

        $googleAccount = GoogleAccount::ofCurrentUser()->findOrFail($request->query('google_account_id'));
        $googleAdsAccountIds = [];
        $gAS = new GoogleAdsService;
        $googleAdsAccountIds = array_merge($googleAdsAccountIds, $gAS->getAccessibleCustomers($googleAccount));

        return ['google_ads_account_ids' => $googleAdsAccountIds];
    }
}
