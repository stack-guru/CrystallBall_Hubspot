<?php

namespace App\Http\Controllers;

use App\Models\UserTwitterAccount;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class TwitterController extends Controller
{
    public function loginRedirect()
    {
        return Socialite::driver('twitter')->redirect();
    }

    public function loginCallback()
    {
        $user   = Socialite::driver('twitter')->user();
        $authId = Auth::id();

        UserTwitterAccount::create([
            'user_id'         => $authId,
            'email'           => $user->getEmail(),
            'avatar'          => $user->getAvatar(),
            'avatar_original' => $user->avatar_original,
            'nickname'        => $user->getNickname(),
            'name'            => $user->getName(),
            'token'           => $user->token,
            'token_secret'    => $user->tokenSecret,
            'payload'         => $user->user,
        ]);

        $message = "<b>". $user->getName(). "</b> account connected successfully.";

        return redirect()->to("/data-source?alertMessage=$message");
    }
}
