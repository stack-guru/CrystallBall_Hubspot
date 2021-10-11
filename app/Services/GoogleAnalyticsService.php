<?php

namespace App\Services;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use Illuminate\Support\Facades\Http;

// https://discovery.googleapis.com/discovery/v1/apis
// https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta

class GoogleAnalyticsService extends GoogleAPIService
{

    /**
     * Get Google Analytics Properties from Google Analytics Account. Refresh access token if necessary
     *
     * @param  \App\Models\GoogleAccount  $googleAccount
     * @param  \App\Models\GoogleAnalyticsAccount  $googleAnalyticsAccount
     * @param  bool  $repeatCall
     * @return mixed
     */
    public function getAccountUAProperties(GoogleAccount $googleAccount, GoogleAnalyticsAccount $googleAnalyticsAccount, $repeatCall = false)
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
                $gCA = $this->getAccountUAProperties($googleAccount, $googleAnalyticsAccount, true);
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
    public function getAccountGA4Properties(GoogleAccount $googleAccount, GoogleAnalyticsAccount $googleAnalyticsAccount, $repeatCall = false)
    {
        $url = "https://analyticsadmin.googleapis.com/v1alpha/properties";

        $response = Http::get($url, [
            'access_token' => $googleAccount->token,
            'filter' => "parent:accounts/" . $googleAnalyticsAccount->ga_id
        ]);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getAccountGA4Properties($googleAccount, $googleAnalyticsAccount, true);
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
        if (!array_key_exists('properties', $respJson)) {
            return false;
        }

        return $respJson['properties'];
    }
}
