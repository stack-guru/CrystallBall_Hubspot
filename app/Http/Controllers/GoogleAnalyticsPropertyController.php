<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ˘GoogleAnalyticsPropertyController extends Controller
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
            $googleAnalyticsPropertiesQuery->select('id', 'name', 'google_account_id', 'google_analytics_account_id', 'was_last_data_fetching_successful', 'is_in_use')
                ->with(['googleAccount:id,name', 'googleAnalyticsAccount:id,name'])
                ->where('name', 'LIKE', '%' . $request->query('keyword') . '%')
                ->whereIn('user_id', $userIdsArray);

            // Check if the current user has any permission set over google analytics accounts
            $googleAnalyticsAccountIdsArray = $user->userGaAccounts->pluck('google_analytics_account_id')->toArray();
            if ($googleAnalyticsAccountIdsArray != [null] && $googleAnalyticsAccountIdsArray != []) {
                $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
            }

            // Check if the price plan has google analytics properties allowed
            if ($user->pricePlan->google_analytics_property_count == -1) {
                abort(402, "Please upgrade your plan to use Google Analytics Properties.");
            }

            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get();
        } else {
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->ofCurrentUser()->get();
        }
        // if user's plan is trial or free new than only return 1 ga account with 1 property
        
        // if (Auth::user()->price_plan_id == PricePlan::TRIAL || Auth::user()->price_plan_id == PricePlan::CODE_FREE_NEW) {
        //     $googleAccounts = $googleAccounts->first();
        // }

        return ['google_analytics_properties' => $googleAnalyticsProperties];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }
}
