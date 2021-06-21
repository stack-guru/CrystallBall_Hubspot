<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UptimeRobotService
{
    private $apiKey;
    private $outputFormat;
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct($outputFormat = 'json')
    {
        $this->apiKey = config('services.uptime_robot.api_key');
        $this->outputFormat = $outputFormat;
    }

    public function getAccountDetails()
    {
        $url = "https://api.uptimerobot.com/v2/getAccountDetails";

        $response = Http::post($url, [
            'api_key' => $this->apiKey,
            'format' => $this->outputFormat,
        ]);

        Log::channel('uptimerobot')->debug($response->body());
        if (!$response->successful()) {
            return false;
        }

        return $this->outputFormat == 'json' ? $response->json() : $response->body();
    }

    public function getMonitors()
    {
        $url = "https://api.uptimerobot.com/v2/getMonitors";

        $response = Http::post($url, [
            'api_key' => $this->apiKey,
            'format' => $this->outputFormat,
        ]);

        Log::channel('uptimerobot')->debug($response->body());
        if (!$response->successful()) {
            return false;
        }

        return $this->outputFormat == 'json' ? $response->json() : $response->body();
    }

    /**
     *
     * param $type // (HTTP, keyword, ping) (1, 3, 4)
     */
    public function newMonitor($name, $link, $type = 1, $interval = 60)
    {
        $url = "https://api.uptimerobot.com/v2/newMonitor";
        $bodyData = [
            'api_key' => $this->apiKey,
            'format' => $this->outputFormat,
            'friendly_name' => $name,
            'url' => $link,
            'interval' => $interval,
            'type' => $type, //type must be a number
        ];
        $response = Http::post($url, $bodyData);

        Log::channel('uptimerobot')->info('Adding web monitor', $bodyData);
        Log::channel('uptimerobot')->debug($response->body());
        if (!$response->successful()) {
            return false;
        }

        if ($response['stat'] == 'fail') {
            return false;
        }

        return $this->outputFormat == 'json' ? $response->json() : $response->body();
    }

    public function deleteMonitor($id)
    {
        $url = "https://api.uptimerobot.com/v2/deleteMonitor";

        $response = Http::post($url, [
            'api_key' => $this->apiKey,
            'format' => $this->outputFormat,
            'id' => $id,
        ]);

        Log::channel('uptimerobot')->debug($response->body());
        if (!$response->successful()) {
            return false;
        }
        if ($response['stat'] == 'fail') {
            return false;
        }

        return $this->outputFormat == 'json' ? $response->json() : $response->body();
    }

}
