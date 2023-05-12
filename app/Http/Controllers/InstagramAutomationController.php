<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InstagramAccount;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class InstagramAutomationController extends Controller
{

    public function setupInstagramAutomation()
    {
        
    }

    public function redirectInstagram()
    {
        return Socialite::driver('instagram')->redirect();
    }

    public function callbackInstagram()
    {
        $user   = Socialite::driver('instagram')->user();
        $authId = Auth::id();

        InstagramAccount::create([
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
        Auth::user()->is_ds_instagram_tracking_enabled = true;
        Auth::user()->save();
        $message = "<b>". $user->getName(). "</b> account connected successfully.";

        return redirect()->to("/data-source?show_instagram_popup=1&alertMessage=$message");
    }

    public function userInstagramAccountsExists(Request $request)
    {
        $instagram_accounts = \auth()->user()->instagram_accounts;
        if ($instagram_accounts->count() > 0){
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
