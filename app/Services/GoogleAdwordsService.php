<?php

namespace App\Services;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Http;

class GoogleAdwordsService
{
    protected $clientId;
    protected $clientSecret;
    protected $developerToken;

    public function __construct()
    {
        $this->clientId = config('services.google.client_id');
        $this->clientSecret = config('services.google.client_secret');
        $this->developerToken = config('services.google.adwords.developer_token');
        //https://googleads.googleapis.com
        //https://googleads.googleapis.com/v6/customers/1234567890/campaignBudgets:mutate

    }

    public function getAccountKeywords(GoogleAccount $googleAccount, $repeatCall = false){
        $url = "https://adwords.google.com/api/adwords/reportdownload/v201809";

        $response = Http::withHeaders([
            'clientCustomerId' => $googleAccount->adwords_client_customer_id,
            'developerToken' => $this->developerToken,
        ])->withToken($googleAccount->token)->asForm()->post($url, [
            '__rdquery' => 'SELECT AdGroupId, AdGroupName, Clicks, Labels FROM KEYWORDS_PERFORMANCE_REPORT',
            '__fmt' => 'XML'
        ]);

        if ($response->status() == 400 && ! $repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if($this->refreshToken($googleAccount) == false){
                return false;
            }else{
                $gAK = $this->getAccountKeywords($googleAccount, true);
                // On success it returns google analytics accounts else false
                if($gAK !== false){
                    return $gAK;
                }else{
                    return false;
                }
            }
        }else if($response->status() == 401 && $repeatCall){
            return false;
        }
        return $response->body();
        $respJson = $response->json();
        if(! array_key_exists('items', $respJson)) return false;

        return $respJson['items'];
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
