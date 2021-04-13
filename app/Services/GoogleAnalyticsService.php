<?php

namespace App\Services;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use Illuminate\Support\Facades\Http;

class GoogleAnalyticsService
{
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->clientId = config('services.google.client_id');
        $this->clientSecret = config('services.google.client_secret');
    }

    /**
     * Get Google Accounts from Google Analytics connected Account. Refresh access token if necessary
     *
     * @param  \App\Models\GoogleAccount  $googleAccount
     * @param  bool  $repeatCall
     * @return mixed
     */
    public function getConnectedAccounts(GoogleAccount $googleAccount, $repeatCall = false)
    {
        $url = "https://www.googleapis.com/analytics/v3/management/accounts";

        $response = Http::get($url, [
            'access_token' => $googleAccount->token,
        ]);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getConnectedAccounts($googleAccount, true);
                // On success it returns google analytics accounts else false
                if ($gCA !== false) {
                    return $gCA;
                } else {
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('items', $respJson)) {
            return false;
        }

        return $respJson['items'];
    }

    /**
     * Get Google Analytics Properties from Google Analytics Account. Refresh access token if necessary
     *
     * @param  \App\Models\GoogleAccount  $googleAccount
     * @param  \App\Models\GoogleAnalyticsAccount  $googleAnalyticsAccount
     * @param  bool  $repeatCall
     * @return mixed
     */
    public function getAccountProperties(GoogleAccount $googleAccount, GoogleAnalyticsAccount $googleAnalyticsAccount, $repeatCall = false)
    {
        $url = "https://www.googleapis.com/analytics/v3/management/accounts/" . $googleAnalyticsAccount->ga_id . "/webproperties";

        $response = Http::get($url, [
            'access_token' => $googleAccount->token,
        ]);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getAccountProperties($googleAccount, $googleAnalyticsAccount, true);
                // On success it returns google analytics accounts else false
                if ($gCA !== false) {
                    return $gCA;
                } else {
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('items', $respJson)) {
            return false;
        }

        return $respJson['items'];
    }

    public function refreshToken(GoogleAccount $googleAccount)
    {
        if (!$googleAccount->refresh_token) {
            return false;
        }

        $url = "https://www.googleapis.com/oauth2/v4/token";

        $response = Http::post($url, [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $googleAccount->refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        if ($response->status() == 401) {
            return false;
        }

        $respJson = $response->json();
        $googleAccount->token = $respJson['access_token'];
        $googleAccount->expires_in = \Carbon\Carbon::now()->addSeconds($respJson['expires_in']);
        $googleAccount->save();

        return $googleAccount;
    }

}
