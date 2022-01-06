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
        $response = $this->executeRequestWithRefresh($googleAccount, 'get', $url, [], $googleAccount->token);

        if ($response == false) {
            Log::channel('google')->error("Unable to refresh access token while accessing Search Console Sites.",  ['GoogleAccount' => $googleAccount->name]);
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

        $url = "https://www.googleapis.com/webmasters/v3/sites/" . urlencode($googleSearchConsoleSite->site_url) . "/searchAnalytics/query";

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
        $response = $this->executeRequestWithRefresh($googleAccount, 'post', $url, $jsonBody, $googleAccount->token);

        if ($response == false) {
            Log::channel('google')->error("Unable to access Google Search Console Site.",  ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
            return false;
        }

        $respJson = $response->json();
        if ($respJson == null) {
            Log::channel('google')->error("Received null json response from server.",  ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url, 'response' => $response]);
            return false;
        }
        if (!array_key_exists('rows', $respJson)) {
            if (array_key_exists('error', $respJson)) {
                Log::channel('google')->error("Error fetching Google Search Console Site Statistics: ", ['message' => $response->json()['error']['message']]);
            } else if (array_key_exists('message', $respJson)) {
                Log::channel('google')->error("Error fetching Google Search Console Site Statistics: ", ['message' => $response->json()['message']]);
            } else {
                Log::channel('google')->error("Error fetching Google Search Console Site Statistics: ", ['message' => $response->json()]);
            }
            return false;
        }

        Log::channel('google')->info("Fetched Google Search Console Site Statistics: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
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

        $url = "https://www.googleapis.com/webmasters/v3/sites/" . urlencode($googleSearchConsoleSite->site_url) . "/searchAnalytics/query";

        $jsonBody = [
            'rowLimit' => 25000,
            'startDate' => $startDate,
            'endDate' => $endDate ?? $startDate,
            'dimensions' => [
                'searchAppearance',
            ],
        ];
        Log::channel('google')->info("Fetching Search Appearance for Site: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
        $response = $this->executeRequestWithRefresh($googleAccount, 'post', $url, $jsonBody, $googleAccount->token);

        if ($response == false) {
            Log::channel('google')->error("Unable to access Google Search Console Site.",  ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
            return false;
        }

        $respJson = $response->json();
        if ($respJson == null) {
            Log::channel('google')->error("Received null json response from server.",  ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url, 'response' => $response]);
            return false;
        }
        if (!array_key_exists('rows', $respJson)) {
            if (array_key_exists('error', $respJson)) {
                Log::channel('google')->error("Error fetching search appearance for Google Search Console Site: ", ['message' => $response->json()['error']['message']]);
            } else if (array_key_exists('message', $respJson)) {
                Log::channel('google')->error("Error fetching search appearance for Google Search Console Site: ", ['message' => $response->json()['message']]);
            } else {
                Log::channel('google')->error("Error fetching search appearance for Google Search Console Site: ", ['message' => $response->json()]);
            }
            return false;
        }

        Log::channel('google')->info("Fetched Google Search Console Site Search Appearance: ", ['GoogleSearchConsoleSite' => $googleSearchConsoleSite->site_url]);
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
