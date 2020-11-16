<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleAccountController extends Controller
{

    public function index()
    {
        return view('ui/app');
    }

    public function create()
    {
        return Socialite::driver('google')
            ->scopes([
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ])
            ->redirect();
    }

    public function store(Request $request)
    {
        $user = Socialite::driver('google')->user();

        $googleAccount = new GoogleAccount;

        $googleAccount->token = $user->token;
        $googleAccount->refresh_token = $user->refreshToken;
        $googleAccount->expires_in = $user->expiresIn;
        $googleAccount->account_id = $user->getId();
        $googleAccount->nick_name = $user->getNickname();
        $googleAccount->name = $user->getName();
        $googleAccount->email = $user->getEmail();
        $googleAccount->avatar = $user->getAvatar();

        $googleAccount->save();

        return ['google_account' => $googleAccount];

    }

    public function destroy(GoogleAccount $googleAccount)
    {
        return ['success' => $googleAccount->delete()];
    }

    public function getProfileFromToken($token)
    {
        $user = Socialite::driver('github')->userFromToken($token);
        return $user;
    }
}
