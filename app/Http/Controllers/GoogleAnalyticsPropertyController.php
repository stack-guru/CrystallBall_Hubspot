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

            // Check if the current user has any permission set over google analytics accounts
            $googleAnalyticsAccountIdsArray = $user->userGaAccounts->pluck('google_analytics_account_id')->toArray();
            if ($googleAnalyticsAccountIdsArray != [null] && $googleAnalyticsAccountIdsArray != []) {
                $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
            }

            // Check if the price plan has limited google analytics properties allowed
            switch ($user->pricePlan->google_analytics_property_count) {
                case 0:
                    break;
                case -1:
                    abort(402, "Please upgrade your plan to use Google Analytics Properties.");
                    break;
                case $user->pricePlan->google_analytics_property_count > 0:
                    // Duplicating whole query builder as we might require it if the limit is not reached
                    $googleAnalyticsPropertiesQueryTemp = $googleAnalyticsPropertiesQuery->clone();

                    $googleAnalyticsProperties = $googleAnalyticsPropertiesQueryTemp->where('is_in_use', true)->get();

                    // If the user has used google analytics properties less than the allowed number then we will show 
                    // all google analytics properties in the list
                    if (count($googleAnalyticsProperties) < $user->pricePlan->google_analytics_property_count) {
                        $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
                    }
                    break;
            }
        } else {
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->ofCurrentUser()->get();
        }

        return ['google_analytics_properties' => $googleAnalyticsProperties];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }
}
