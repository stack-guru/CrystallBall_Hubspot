<?php

namespace App\Services;

use App\Models\GoogleAccount;
use App\Models\GoogleSearchConsoleSite;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class GoogleSearchConsoleService extends GoogleAPIService
{
    public function getSites(GoogleAccount $googleAccount,  $repeatCall = false)
    {
        $url = "https://www.googleapis.com/webmasters/v3/sites";

        Log::channel('google')->info("Fetching Sites: ", ['GoogleAccount' => $googleAccount->name]);
        $response = Http::withToken($googleAccount->token)->get($url);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getSites($googleAccount, true);
                // On success it returns google analytics accounts else false
                if ($gCA !== false) {
                    return $gCA;
                } else {
                    Log::channel('google')->error("Unable to refresh access token while accessing Search Console Sites.",  ['GoogleAccount' => $googleAccount->name]);
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('siteEntry', $respJson)) {
            if (array_key_exists('error', $respJson)) Log::channel('google')->error("Error fetching Sites: ", ['message' => $response->json()['error']['message']]);
            return false;
        }

        Log::channel('google')->info("Fetched Sites: ", ['GoogleAccount' => $googleAccount->name]);

        return $respJson['siteEntry'];
    }

    public function getGSCStatistics(GoogleAccount $googleAccount, GoogleSearchConsoleSite $googleSearchConsoleSite, $startDate, $endDate = null, $repeatCall = false)
    {

        $url = "https://www.googleapis.com/webmasters/v3/sites/$googleSearchConsoleSite->site_url/searchAnalytics/query";

        $jsonBody = [
            'rowLimit' => 25000,
            'startDate' => $startDate,
            'endDate' => $endDate ?? $startDate,
            'dimensions' => [
                'query',
                'page',
                'country',
                'device',
                'date',
            ],
        ];
        Log::channel('google')->info("Fetching Statistics for Site: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
        $response = Http::withToken($googleAccount->token)->post($url, $jsonBody);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getGSCStatistics($googleAccount, $googleSearchConsoleSite, $startDate, $endDate, true);
                // On success it returns google analytics accounts else false
                if ($gCA !== false) {
                    return $gCA;
                } else {
                    Log::channel('google')->error("Unable to refresh access token while accessing Google Search Console Site.",  ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('rows', $respJson)) {
            if (array_key_exists('error', $respJson)) Log::channel('google')->error("Error fetching Google Search Console Site: ", ['message' => $response->json()['error']['message']]);
            return false;
        }

        Log::channel('google')->info("Fetched Google Search Console Sites: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
        return array_map(function ($r) {
            return [
                'values' => $r['keys'],
                "clicks" => $r['clicks'],
                "impressions" => $r['impressions'],
                "ctr" => $r['ctr'],
                "position" => $r['position'],
            ];
        }, $respJson['rows']);
    }

    public function getGSCSearchAppearance(GoogleAccount $googleAccount, GoogleSearchConsoleSite $googleSearchConsoleSite, $startDate, $endDate = null, $repeatCall = false)
    {

        $url = "https://www.googleapis.com/webmasters/v3/sites/$googleSearchConsoleSite->site_url/searchAnalytics/query";

        $jsonBody = [
            'rowLimit' => 25000,
            'startDate' => $startDate,
            'endDate' => $endDate ?? $startDate,
            'dimensions' => [
                'searchAppearance',
            ],
        ];
        Log::channel('google')->info("Fetching Statistics for Site: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
        $response = Http::withToken($googleAccount->token)->post($url, $jsonBody);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getGSCStatistics($googleAccount, $googleSearchConsoleSite, $startDate, $endDate, true);
                // On success it returns google analytics accounts else false
                if ($gCA !== false) {
                    return $gCA;
                } else {
                    Log::channel('google')->error("Unable to refresh access token while accessing Google Search Console Site.",  ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('rows', $respJson)) {
            if (array_key_exists('error', $respJson)) Log::channel('google')->error("Error fetching Google Search Console Site: ", ['message' => $response->json()['error']['message']]);
            return false;
        }

        Log::channel('google')->info("Fetched Google Search Console Sites: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
        return array_map(function ($r) {
            return [
                'values' => $r['keys'],
                "clicks" => $r['clicks'],
                "impressions" => $r['impressions'],
                "ctr" => $r['ctr'],
                "position" => $r['position'],
            ];
        }, $respJson['rows']);
    }
}
