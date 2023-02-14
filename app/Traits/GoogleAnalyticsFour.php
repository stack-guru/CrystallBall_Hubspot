<?php

namespace App\Traits;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAnalyticsAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

// https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta

trait GoogleAnalyticsFour
{
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
        $url = "https://analyticsadmin.googleapis.com/v1beta/properties";

        Log::channel('google')->info("Getting GA4 Account Properties: ", ['GoogleAccount' => $googleAnalyticsAccount->ga_id]);
        $response = $this->executeRequestWithRefresh($googleAccount, 'get', $url, [
            'access_token' => $googleAccount->token,
            'filter' => "parent:accounts/" . $googleAnalyticsAccount->ga_id
        ]);

        if ($response == false) {
            Log::channel('google')->error("Error fetching GA4 Properties: ", ['GoogleAnalyticsAccount' => $googleAnalyticsAccount->ga_id]);
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('properties', $respJson)) {
            if (array_key_exists('error', $respJson)) {
                Log::channel('google')->error("Error fetching GA4 Properties: ", ['message' => $response->json()['error']['message']]);
            } else {
                Log::channel('google')->error("Error fetching GA4 Properties: ", ['data' => $response->json(), 'status' => $response->status()]);
            }
            return false;
        }

        Log::channel('google')->info("Received GA4 Account Properties: ", ['GoogleAccount' => $googleAnalyticsAccount->ga_id]);
        return $respJson['properties'];
    }

    private function getGA4MetricsAndDimensions(GoogleAccount $googleAccount, GoogleAnalyticsProperty $googleAnalyticsProperty, $startDate, $endDate = null, $repeatCall = false)
    {
        $url = "https://analyticsdata.googleapis.com/v1beta/properties/$googleAnalyticsProperty->internal_property_id:runReport";

        $jsonBody = [
            'limit' => 100000,
            'dateRanges' => [
                ['endDate' => $endDate ?? $startDate, 'startDate' => $startDate]
            ],
            'metrics' => [
                ['name' => 'activeUsersN', 'expression' => 'activeUsers'],
                ['name' => 'sessionsN', 'expression' => 'sessions'],
                ['name' => 'eventCountN', 'expression' => 'eventCount'],
                ['name' => 'conversionsN', 'expression' => 'conversions']
            ],
            'dimensions' => [
                ['name' => 'date'],
                ['name' => 'sessionSource'],
                ['name' => 'sessionMedium'],
                ['name' => 'deviceCategory']
            ],
            'orderBys' => [
                [
                    'desc' => true,
                    'dimension' => ['dimensionName' => 'date', 'orderType' => 'NUMERIC']
                ]
            ]
        ];
        Log::channel('google')->info("Fetching GA4 Account Metrics and Dimensions: ", ['GoogleAccount' => $googleAnalyticsProperty->internal_property_id]);
        $response = $this->executeRequestWithRefresh($googleAccount, 'post', $url, $jsonBody, $googleAccount->token);

        if ($response == false) {
            Log::channel('google')->error("Error fetching GA4 Metrics and Dimensions: ", ['message' => $googleAnalyticsProperty->internal_property_id]);
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('rows', $respJson)) {
            if (array_key_exists('error', $respJson)) Log::channel('google')->error("Error fetching GA4 Properties: ", ['message' => $response->json()['error']['message']]);
            return false;
        }

        Log::channel('google')->info("Fetched GA4 Account Metrics and Dimensions: ", ['GoogleAccount' => $googleAnalyticsProperty->internal_property_id]);
        return array_map(function ($r) {
            return [
                'dimensions' => array_map(function ($d) {
                    return $d['value'];
                }, $r['dimensionValues']),
                'metrics' => array_map(function ($d) {
                    return $d['value'];
                }, $r['metricValues']),
            ];
        }, $respJson['rows']);
    }
}
