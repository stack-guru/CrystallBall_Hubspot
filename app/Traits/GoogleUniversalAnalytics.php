<?php

namespace App\Traits;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

// https://discovery.googleapis.com/discovery/v1/apis

trait GoogleUniversalAnalytics
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

        Log::channel('google')->info("Getting UA Account Properties: ", ['GoogleAccount' => $googleAnalyticsAccount->ga_id]);
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
            Log::channel('google')->error("Unable to refresh access token while accessing UA Property.",  ['GoogleAccount' => $googleAnalyticsAccount->ga_id]);
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('items', $respJson)) {
            Log::channel('google')->error("Error fetching UA Properties: ", ['message' => $response->json()['error']['message']]);
            return false;
        }

        Log::channel('google')->info("Received UA Account Properties: ", ['GoogleAccount' => $googleAnalyticsAccount->ga_id]);
        return $respJson['items'];
    }

    private function getUAMetricsAndDimensions(GoogleAccount $googleAccount, GoogleAnalyticsProperty $googleAnalyticsProperty, $startDate, $endDate = null, $repeatCall = false)
    {
        $url = "https://content-analyticsreporting.googleapis.com/v4/reports:batchGet?alt=json";

        $jsonBody = [
            'reportRequests' => [
                [
                    'viewId' => (string) $googleAnalyticsProperty->internal_property_id,
                    'dateRanges' => [
                        ['endDate' => $endDate ?? $startDate, 'startDate' => $startDate]
                    ],
                    'metrics' => [
                        ['expression' => 'ga:users'],
                        ['expression' => 'ga:sessions'],
                        ['expression' => 'ga:totalEvents']
                    ],
                    'dimensions' => [
                        ['name' => 'ga:date'],
                        ['name' => 'ga:source'],
                        ['name' => 'ga:medium'],
                        ['name' => 'ga:deviceCategory']
                    ],
                    'orderBys' => [
                        ['fieldName' => 'ga:date']
                    ]
                ]
            ]
        ];
        Log::channel('google')->info("Fetching UA Account Metrics and Dimensions: ", ['GoogleAccount' => $googleAnalyticsProperty->internal_property_id]);
        $response = Http::withToken($googleAccount->token)->post($url, $jsonBody);

        if ($response->status() == 401 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gCA = $this->getUAMetricsAndDimensions($googleAccount, $googleAnalyticsProperty, $startDate, $endDate, true);
                // On success it returns google analytics accounts else false
                if ($gCA !== false) {
                    return $gCA;
                } else {
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            Log::channel('google')->error("Unable to refresh access token while accessing UA Property.",  ['GoogleAccount' => $googleAnalyticsAccount->ga_id]);
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('reports', $respJson)) {
            Log::channel('google')->error("Error fetching UA Properties: ", ['message' => $response->json()['error']['message']]);
            return false;
        }

        Log::channel('google')->info("Fetched UA Account Metrics and Dimensions.", ['GoogleAccount' => $googleAnalyticsProperty->internal_property_id]);
        return array_map(function ($r) {
            return [
                'dimensions' => $r['dimensions'],
                'metrics' => $r['metrics'][0]['values']
            ];
        }, $respJson['reports'][0]['data']);
    }
}
