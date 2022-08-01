<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class FacebookAutomationController extends Controller
{
    public function redirectFacebook()
    {
        return Socialite::driver('facebook')->scopes([
            'pages_show_list',
            'pages_read_engagement',
        ])->redirect();
    }

    public function callbackFacebook()
    {
        $user = Socialite::driver('facebook');
        dd($user, $user->user());
    }
}
