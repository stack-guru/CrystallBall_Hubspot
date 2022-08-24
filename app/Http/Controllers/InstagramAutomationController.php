<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class InstagramAutomationController extends Controller
{
    public function redirectInstagram(Request $request)
    {
        return Socialite::driver('instagram')->redirect();
    }

    public function callbackInstagram(Request $request)
    {
        $user = Socialite::driver('facebook')->user();
        dd($request->all(), $user);
    }
}
