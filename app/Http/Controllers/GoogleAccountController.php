<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Requests\GoogleAccountRequest;
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
        return ['google_accounts' => $googleAccounts];
    }

    public function create(Request $request)
    {
        if ($request->has('google_analytics_perm')) {
            $scopes = [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ];
            if ($request->google_analytics_perm == 'true') {
                array_push($scopes, 'https://www.googleapis.com/auth/analytics.readonly');
            }
            if ($request->google_search_console_perm == 'true') {
                array_push($scopes, 'https://www.googleapis.com/auth/webmasters');
                array_push($scopes, 'https://www.googleapis.com/auth/webmasters.readonly');
            }
            if ($request->google_ads_perm == 'true') {
                array_push($scopes, 'https://www.googleapis.com/auth/adwords');
            }
        } else {
            $scopes = [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',

                'https://www.googleapis.com/auth/analytics.readonly',

                'https://www.googleapis.com/auth/webmasters',
                'https://www.googleapis.com/auth/webmasters.readonly',
            ];

            if (config('app.env') == 'development' || config('app.env') == 'local') {
                array_push($scopes, 'https://www.googleapis.com/auth/adwords');
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

        return redirect()->route('google-account.index', ['google_account_id' => $googleAccount->id, 'do-refresh' => true]);
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

        return ['success' => $googleAccount->delete()];
    }
}
