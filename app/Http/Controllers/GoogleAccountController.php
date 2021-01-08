<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAccountController extends Controller
{

    public function index()
    {
        return view('ui/app');
    }

    public function uiIndex()
    {
        $googleAccounts = GoogleAccount::where('user_id', Auth::id())->get();
        return ['google_accounts' => $googleAccounts];
    }

    public function create()
    {
        return Socialite::driver('google')
            ->scopes([
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/analytics.readonly',
            ])
            ->with(['access_type' => 'offline'])
            ->redirect();
    }

    public function store()
    {
        $user = Socialite::driver('google')->stateless()->user();
        $googleAccountId = $user->getId();
        if (GoogleAccount::where('account_id', $googleAccountId)->where('user_id', \Auth::id())->first()) {
            return redirect()->route('google-account.index', ['success' => 'false', 'message' => 'Account already linked']);
        }

        $googleAccount = new GoogleAccount;

        $googleAccount->token = $user->token;
        $googleAccount->refresh_token = $user->refreshToken;
        $googleAccount->expires_in = \Carbon\Carbon::now()->addSeconds($user->expiresIn);
        $googleAccount->account_id = $googleAccountId;
        $googleAccount->nick_name = $user->getNickname();
        $googleAccount->name = $user->getName();
        $googleAccount->email = $user->getEmail();
        $googleAccount->avatar = $user->getAvatar();
        $googleAccount->user_id = Auth::id();

        $googleAccount->save();

        return redirect()->route('google-account.index', ['google_account_id' => $googleAccount->id, 'do-refresh' => true]);

    }

    public function destroy(GoogleAccount $googleAccount)
    {
        return ['success' => $googleAccount->delete()];
    }

}
