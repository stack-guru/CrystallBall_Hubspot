<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Requests\GoogleAccountRequest;
use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleSearchConsoleSite;
use App\Models\PricePlan;
use App\Models\User;
use App\Services\GoogleAPIService;

class GoogleAccountController extends Controller
{

    public function index()
    {
        return view('ui/app');
    }

    public function uiIndex()
    {
        $googleAccounts = GoogleAccount::ofCurrentUser()->get();
        // if user's plan is trial or free new than only return 1 ga account with 1 property
        if (Auth::user()->price_plan_id == PricePlan::TRIAL || Auth::user()->price_plan_id == PricePlan::CODE_FREE_NEW) {
            $googleAccounts = $googleAccounts->first();
        }
        return ['google_accounts' => $googleAccounts];
    }

    public function create(Request $request)
    {
        if ($request->has('google_analytics_perm') || $request->has('google_search_console_perm') || $request->has('google_ads_perm')) {
            $scopes = [
                GoogleAccount::SCOPE_AUTH_USERINFO_PROFILE,
                GoogleAccount::SCOPE_AUTH_USERINFO_EMAIL,
            ];
            if ($request->google_analytics_perm == 'true') {
                array_push($scopes, GoogleAccount::SCOPE_AUTH_ANALYTICS_READONLY);
            }
            if ($request->google_search_console_perm == 'true') {
                array_push($scopes, GoogleAccount::SCOPE_AUTH_WEBMASTERS);
                array_push($scopes, GoogleAccount::SCOPE_AUTH_WEBMASTERS_READONLY);
            }
            if (config('app.env') == 'development' || config('app.env') == 'local') {
                if ($request->google_ads_perm == 'true') {
                    array_push($scopes, GoogleAccount::SCOPE_AUTH_ADWORDS);
                }
            }
        } else {
            $scopes = [
                GoogleAccount::SCOPE_AUTH_USERINFO_PROFILE,
                GoogleAccount::SCOPE_AUTH_USERINFO_EMAIL,

                GoogleAccount::SCOPE_AUTH_ANALYTICS_READONLY,

                GoogleAccount::SCOPE_AUTH_WEBMASTERS,
                GoogleAccount::SCOPE_AUTH_WEBMASTERS_READONLY,
            ];

            if (config('app.env') == 'development' || config('app.env') == 'local') {
                array_push($scopes, GoogleAccount::SCOPE_AUTH_ADWORDS);
            }
        }

        return Socialite::driver('google')
            ->scopes($scopes)
            ->with(['access_type' => 'offline'])
            ->redirect();
    }

    public function store(Request $request)
    {
        $user = Socialite::driver('google')->stateless()->user();
        $googleAccountId = $user->getId();

        $googleAccount = GoogleAccount::where('account_id', $googleAccountId)->ofCurrentUser()->first();
        if (!$googleAccount) {
            $googleAccount = new GoogleAccount;
        }

        $this->addGoogleAccount($user, $googleAccount, Auth::user());

        return redirect()->route('accounts', ['google_account_id' => $googleAccount->id, 'do-refresh' => true]);
    }

    public function update(GoogleAccountRequest $request, GoogleAccount $googleAccount)
    {
        $googleAccount->fill($request->validated());
        $googleAccount->save();
        return $googleAccount;
    }

    public function destroy(GoogleAccount $googleAccount)
    {
        (new GoogleAPIService)->revokeAccess($googleAccount);

        GoogleAnalyticsProperty::destroy(GoogleAnalyticsProperty::where('google_account_id', $googleAccount->id)->get());
        $googleSearchConsoleSites = GoogleSearchConsoleSite::where('google_account_id', $googleAccount->id)->get();
        foreach ($googleSearchConsoleSites as $gSCS) {
            GoogleAnalyticsProperty::where('google_search_console_site_id', $gSCS->id)->update([
                'google_search_console_site_id' => null
            ]);
            $gSCS->delete();
        }
        return ['success' => $googleAccount->delete()];
    }
}
