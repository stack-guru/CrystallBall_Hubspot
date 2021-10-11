<?php

namespace App\Traits;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Support\Facades\Http;

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
                        ['expression' => 'ga:goalConversionRateAll']
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
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('reports', $respJson)) {
            return false;
        }

        return array_map(function ($r) {
            return [
                'dimensions' => $r['dimensions'],
                'metrics' => $r['metrics'][0]['values']
            ];
        }, $respJson['reports'][0]['data']);
    }
}
