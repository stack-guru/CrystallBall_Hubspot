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

        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::with(['googleAccount', 'googleAnalyticsAccount'])->orderBy('name');
        if ($request->has('keyword')) {
            $googleAnalyticsPropertiesQuery->select('id', 'name', 'google_account_id', 'google_analytics_account_id', 'was_last_data_fetching_successful')
                ->with(['googleAccount:id,name', 'googleAnalyticsAccount:id,name'])
                ->where('name', 'LIKE', '%' . $request->query('keyword') . '%')
                ->whereIn('user_id', $userIdsArray);

            $googleAnalyticsAccountIdsArray = Auth::user()->userGaAccounts->pluck('google_analytics_account_id')->toArray();
            if ($googleAnalyticsAccountIdsArray != [null] && $googleAnalyticsAccountIdsArray != []) {
                $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
            }
        } else {
            $googleAnalyticsPropertiesQuery->ofCurrentUser();
        }

        return ['google_analytics_properties' => $googleAnalyticsPropertiesQuery->get()];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }
}
