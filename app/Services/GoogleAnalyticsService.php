<?php

namespace App\Services;

use App\Traits\GoogleUniversalAnalytics;
use App\Traits\GoogleAnalyticsFour;
use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAccount;

class GoogleAnalyticsService extends GoogleAPIService
{
    use GoogleUniversalAnalytics, GoogleAnalyticsFour;

    public function getMetricsAndDimensions(GoogleAccount $googleAccount, GoogleAnalyticsProperty $googleAnalyticsProperty, $startDate, $endDate = null)
    {
        switch ($googleAnalyticsProperty->kind) {
            case 'analytics#webproperty':
                $response = $this->getUAMetricsAndDimensions($googleAccount, $googleAnalyticsProperty, $startDate, $endDate);
                break;

            case 'analytics#ga4property':
                $response = $this->getGA4MetricsAndDimensions($googleAccount, $googleAnalyticsProperty, $startDate, $endDate);
                break;
        }
        return $response;
    }
}
