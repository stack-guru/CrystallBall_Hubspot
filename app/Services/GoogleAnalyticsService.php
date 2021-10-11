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
        // If you hit a UA property with GA4 API you will get "Either this isn't a Gold property or it hasn't been migrated yet and you should specify a scion_profile_id instead.; while checking access against Config Service"
        // If you hit a GA4 property with UA API you will get "User does not have sufficient permissions for this profile."
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
