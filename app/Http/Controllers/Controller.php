<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use App\Models\GoogleAccount;
use Illuminate\Support\Carbon;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * This function adds Google Account in User using Socialite Google Driver
     *
     * @param  \Laravel\Socialite\Two\User  $googleUser
     * @param  \App\Models\GoogleAccount  $googleAccount
     * @param  \App\Models\User  $user
     * @return void
     */
    public function addGoogleAccount($googleUser, $googleAccount, $user)
    {
        $request = request();
        $googleAccountId = $googleUser->getId();

        $allowedScopes = explode(" ", $request->query('scope'));

        $googleAccount->token = $googleUser->token;
        $googleAccount->refresh_token = $googleUser->refreshToken;
        $googleAccount->expires_in = Carbon::now()->addSeconds($googleUser->expiresIn);
        $googleAccount->account_id = $googleAccountId;
        $googleAccount->nick_name = $googleUser->getNickname();
        $googleAccount->name = $googleUser->getName();
        $googleAccount->email = $googleUser->getEmail();
        $googleAccount->avatar = $googleUser->getAvatar();
        $googleAccount->user_id = $user->id;
        $googleAccount->scopes = json_encode($allowedScopes);
        $googleAccount->state = $request->query('state');

        $googleAccount->save();

        if ($googleAccount->hasGoogleAnalyticsScope()) {
            $googleAnalyticsAccountController = new GoogleAnalyticsAccountController;
            $googleAnalyticsAccountController->fetch($googleAccount);
        }
        if ($googleAccount->hasSearchConsoleScope()) {
            $googleSearchConsoleSiteController = new GoogleSearchConsoleSiteController;
            $googleSearchConsoleSiteController->fetch($googleAccount);
        }
    }
}
