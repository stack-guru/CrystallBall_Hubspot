<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VisualCrossingService
{

    protected $appKey, $visualCrossingDomain, $city, $callURISuffix;
    public $excludeParts;

    public function __construct()
    {
        $this->appKey = config('services.visual_crossing.api.key');
        $this->visualCrossingDomain = "https://weather.visualcrossing.com";
        $this->callURISuffix = '';

        // current,minutely,hourly,daily, alerts
        $this->excludeParts = $excludeParts;
    }

}
