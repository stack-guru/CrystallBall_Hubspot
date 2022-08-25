<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class InstagramAutomationController extends Controller
{
    public function redirectInstagram(Request $request)
    {
        return Socialite::driver('facebook')->scopes([
            'instagram_basic',
            'pages_show_list',
            'instagram_manage_insights',
        ])->redirect();
    }

    public function callbackInstagram(Request $request)
    {
        $user = Socialite::driver('instagram')->user();
        dd($request->all(), $user);
    }
}
