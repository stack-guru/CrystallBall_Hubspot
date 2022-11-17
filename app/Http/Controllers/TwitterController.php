<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class TwitterController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('twitter')->redirect();
    }

    public function callback()
    {
        $user = Socialite::driver('twitter')->user();
        Log::debug("Twitter login!",[$user]);
        dd($user);
    }
}
