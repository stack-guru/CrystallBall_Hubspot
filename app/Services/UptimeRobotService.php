<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class UptimeRobotService
{
    private $apiKey;
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct()
    {
       $this->apiKey = config('services.uptime_robot.api_key');
    }

    public function getAccountDetails()
    {
        $url= "https://api.uptimerobot.com/v2/getAccountDetails";

        $response = Http::post($url, [
            'api_key' => $this->apiKey,
        ]);
        return $response->json();   
    }

    public function getMonitors()
    {
        $url= "https://api.uptimerobot.com/v2/getMonitors";

        $response = Http::post($url, [
            'api_key' => $this->apiKey,
        ]);
        return $response->json();   
    }
    
    public function newMonitor($name,$urll,$type)
    {
        $url= "https://api.uptimerobot.com/v2/newMonitor";
        $response = Http::post($url, [
            'api_key' => $this->apiKey,
            'format' => 'json',
            'friendly_name' => $name,
            'url' => $urll,
            'type' => $type, //type must be a number
        ]);
        return $response->json();  
    }

    public function deleteMonitor($id)
    {
        $url= "https://api.uptimerobot.com/v2/deleteMonitor";

        $response = Http::post($url, [
            'api_key' => $this->apiKey,
            'id' => $id,
        ]);
        return $response->json();   
    }   

}