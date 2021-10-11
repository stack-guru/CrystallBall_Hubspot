<?php

namespace App\Services;

use App\Traits\GoogleUniversalAnalytics;
use App\Traits\GoogleAnalyticsFour;

class GoogleAnalyticsService extends GoogleAPIService
{
    use GoogleUniversalAnalytics, GoogleAnalyticsFour;
}
