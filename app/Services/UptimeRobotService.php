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

    public function getAllMonitors()
    {
        $monitors = [];
        $offset = 0;
        $limit = 50;
        do {
            $newMonitors = $this->getMonitors($offset)['monitors'];
            $monitors = array_merge($monitors, $newMonitors);
            $offset += $limit;
        } while (count($newMonitors));

        return ['monitors' => $monitors];
    }

    // 50 is the maximum possible value for limit
    public function getMonitors($offset = 0, $limit = 50)
    {
        $url = "https://api.uptimerobot.com/v2/getMonitors";

        Log::channel('uptimerobot')->info("Fetching all monitor with statuses.");
        $response = Http::post($url, [
            'api_key' => $this->apiKey,
            'format' => $this->outputFormat,
            'offset' => $offset,
            'limit' => $limit
        ]);
        Log::channel('uptimerobot')->info("Fetching all monitor statuses.", ['response' => $response->body()]);

        if (!$response->successful()) {
            return false;
        }

        return $this->outputFormat == 'json' ? $response->json() : $response->body();
    }

    /**
     *
     * param $type // (HTTP, keyword, ping) (1, 3, 4)
     */
    public function newMonitor($name, $link, $type = 1, ?int $interval = null)
    {
        $url = "https://api.uptimerobot.com/v2/newMonitor";
        $bodyData = [
            'api_key' => $this->apiKey,
            'format' => $this->outputFormat,
            'friendly_name' => $name,
            'url' => $link,
            'interval' => is_null($interval) ? config('services.uptime_robot.interval') : $interval,
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
