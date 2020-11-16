<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Auth;

class GoogleAccountController extends Controller
{

    public function index()
    {
        return view('ui/app');
    }

    public function uiIndex()
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

    public function store()
    {
        $user = Socialite::driver('google')->stateless()->user();

        $googleAccount = new GoogleAccount;

        $googleAccount->token = $user->token;
        $googleAccount->refresh_token = $user->refreshToken;
        $googleAccount->expires_in = \Carbon\Carbon::now()->addSeconds($user->expiresIn);
        $googleAccount->account_id = $user->getId();
        $googleAccount->nick_name = $user->getNickname();
        $googleAccount->name = $user->getName();
        $googleAccount->email = $user->getEmail();
        $googleAccount->avatar = $user->getAvatar();

        $googleAccount->user_id = Auth::id();

        $googleAccount->save();

        return redirect()->route('google-account.index');

    }

    public function destroy(GoogleAccount $googleAccount)
    {
        return ['success' => $googleAccount->delete()];
    }

    public function getProfileFromToken($token)
    {
        $user = Socialite::driver('google')->userFromToken($token);
        return $user;
    }
}
