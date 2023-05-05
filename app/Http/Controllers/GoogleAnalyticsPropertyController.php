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

        $googleAnalyticsPropertiesQuery = GoogleAnalyticsProperty::with(['googleAccount', 'googleAnalyticsAccount']);
        if ($request->has('keyword')) {
            $googleAnalyticsPropertiesQuery->select('id', 'name', 'google_account_id', 'google_analytics_account_id', 'was_last_data_fetching_successful', 'is_in_use')
                ->with(['googleAccount:id,name', 'googleAnalyticsAccount:id,name'])
                ->where('name', 'LIKE', '%' . $request->query('keyword') . '%')
                ->whereIn('user_id', $userIdsArray);

            // Check if the current user has any permission set over google analytics accounts
            $googleAnalyticsAccountIdsArray = [];


//            $user->userGaAccounts->pluck('google_analytics_account_id')->toArray();
            if (!empty($user->assigned_properties_id)) {
                $googleAnalyticsAccountIdsArray = array_map('intval', array_map('trim', explode(',', $user->assigned_properties_id)));
            }
            if (count($googleAnalyticsAccountIdsArray) > 0) {
//                $googleAnalyticsPropertiesQuery->whereIn('google_analytics_account_id', $googleAnalyticsAccountIdsArray);
                $googleAnalyticsPropertiesQuery->whereIn('id', $googleAnalyticsAccountIdsArray);
            }

            // Check if the price plan has google analytics properties allowed
            if ($user->pricePlan->google_analytics_property_count == -1) {
                abort(402, "Please upgrade your plan to use Google Analytics Properties.");
            }

            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->get(); //->unique('name');
        } else {
            $googleAnalyticsProperties = $googleAnalyticsPropertiesQuery->ofCurrentUser();

            if ($request->has('sortBy') && $request->sortBy) {
                $googleAnalyticsProperties = $googleAnalyticsProperties->orderByRaw("$request->sortBy * 1 desc");
            }
            // return $googleAnalyticsProperties->toSql();
            $googleAnalyticsProperties = $googleAnalyticsProperties->get(); //->unique('name');

        }
        // if user's plan is trial or free new than only return 1 ga account with 1 property

        // if (Auth::user()->price_plan_id == PricePlan::TRIAL || Auth::user()->price_plan_id == PricePlan::CODE_FREE_NEW) {
        //     $googleAccounts = $googleAccounts->first();
        // }

        $uniqueGoogleAnalyticsProperties = collect($googleAnalyticsProperties)->unique('name')->values()->all();
        return ['google_analytics_properties' => $uniqueGoogleAnalyticsProperties];
    }

    public function update(Request $request, GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $this->validate($request, [
            'google_search_console_site_id' => 'bail|required|numeric|exists:google_search_console_sites,id'
        ]);

        if (Auth::id() !== $googleAnalyticsProperty->user_id) {
            abort(404, 'Unable to find referenced Google Analytics Property.');
        }

        if ($request->has('google_search_console_site_id')) $googleAnalyticsProperty->google_search_console_site_id = $request->google_search_console_site_id;
        $googleAnalyticsProperty->save();

        $googleAnalyticsProperty->load('googleAccount');
        return ['google_analytics_property' => $googleAnalyticsProperty];
    }

    public function destroy(GoogleAnalyticsProperty $googleAnalyticsProperty)
    {
        $googleAnalyticsProperty->delete();
        return ['success' => true];
    }
}
