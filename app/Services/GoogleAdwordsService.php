<?php

namespace App\Services;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Http;

class GoogleAdwordsService
{
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->clientId = config('services.google.client_id');
        $this->clientSecret = config('services.google.client_secret');
        //https://googleads.googleapis.com
        //https://googleads.googleapis.com/v6/customers/1234567890/campaignBudgets:mutate

    }



    public function refreshToken(GoogleAccount $googleAccount)
    {
        if(! $googleAccount->refresh_token) return false;
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
