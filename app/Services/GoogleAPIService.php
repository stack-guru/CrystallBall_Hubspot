<?php

namespace App\Services;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class GoogleAPIService
{
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->clientId = config('services.google.client_id');
        $this->clientSecret = config('services.google.client_secret');
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
        if (!array_key_exists('access_token', $respJson)) {
            return false;
        }

        $googleAccount->token = $respJson['access_token'];
        $googleAccount->expires_in = \Carbon\Carbon::now()->addSeconds($respJson['expires_in']);
        $googleAccount->save();

        return $googleAccount;
    }

    public function executeRequestWithRefresh($googleAccount, $method, $url, $payload = [], $token = null)
    {
        if ($token) {
            $response = Http::withToken($token)->{$method}($url, $payload);
        } else {
            $response = Http::{$method}($url, $payload);
        }

        if ($response->status() == 401) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                Log::channel('google')->error("Unable to refresh access token for google account.",  ['GoogleAccount' => $googleAccount->email]);
                $this->timestampToken($googleAccount, true);
                return false;
            } else {
                $response = Http::{$method}($url, $payload);
                if ($response->successful()) {
                    $this->timestampToken($googleAccount, false);
                } else {
                    $this->timestampToken($googleAccount, true);
                }
                return $response;
            }
        } else if ($response->successful()) {
            $this->timestampToken($googleAccount, false);
            return $response;
        } else {
            $this->timestampToken($googleAccount, true);
            return $response;
        }
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

        $response = $this->executeRequestWithRefresh($googleAccount, 'get', $url, [
            'access_token' => $googleAccount->token,
        ]);

        if ($response == false) {
            return false;
        }

        $respJson = $response->json();
        if (array_key_exists('error', $respJson) && array_key_exists('message', $respJson['error'])) {
            if ($respJson['error']['message'] == "User does not have any Google Analytics account.") {
                Log::channel('google')->error($respJson['error']['message'],  ['GoogleAccount' => $googleAccount->name]);
                return [];
            }
        }
        if (!array_key_exists('items', $respJson)) {
            return false;
        }

        return $respJson['items'];
    }

    public function revokeAccess($googleAccount)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/revoke?token=' . $googleAccount->token);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "-X");
        curl_setopt($ch, CURLOPT_POST, 1);

        $headers = array();
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            return false;
        }
        curl_close($ch);
    }

    public function timestampToken($googleAccount, $didErrorOccur = false, $response = ''): bool
    {
        if ($didErrorOccur) {
            $googleAccount->last_unsuccessful_use_at = Carbon::now();
            return $googleAccount->save();
        } else {
            $googleAccount->last_successful_use_at = Carbon::now();
            return $googleAccount->save();
        }
    }
}
