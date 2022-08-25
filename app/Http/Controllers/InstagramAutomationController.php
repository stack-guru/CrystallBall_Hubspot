<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class InstagramAutomationController extends Controller
{
    public function redirectInstagram(Request $request)
    {
        return Socialite::driver('instagrambasic')->scopes([
            'instagram_graph_user_media',
            'instagram_graph_user_profile'
        ])->redirect();
    }

    public function callbackInstagram(Request $request)
    {
        $user = Socialite::driver('instagrambasic')->user();
        dd($request->all(), $user);
    }
}
