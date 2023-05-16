<?php

namespace App\Http\Controllers;

use App\Models\UserTwitterAccount;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

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
        Auth::user()->is_ds_twitter_tracking_enabled = true;
        Auth::user()->save();
        $message = "<b>". $user->getName(). "</b> account connected successfully.";

        return redirect()->to("/data-source?show_twitter_popup=1&alertMessage=$message");
    }

    public function userTwitterAccountsExists(Request $request)
    {
        $twitter_accounts = \auth()->user()->twitterAccounts;
        if ($twitter_accounts->count() > 0){
            $exists = true;
        }
        else{
            $exists = false;
        }
        return response()->json([
            'exists' => $exists
        ]);
    }
}
