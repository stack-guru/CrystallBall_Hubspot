<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenWeatherMapService
{

    protected $appId, $openWeatherDomain, $city, $callURISuffix;
    public $excludeParts;

    public function __construct($excludeParts = ['current', 'minutely', 'hourly', 'daily'])
    {
        $this->appId = config('services.open_weather_map.app.id');
        $this->openWeatherDomain = "https://api.openweathermap.org";
        $this->callURISuffix = '';

        // current,minutely,hourly,daily, alerts
        $this->excludeParts = $excludeParts;
    }

    public function currentWeather($city)
    {

        $response = Http::get($this->openWeatherDomain . "/data/2.5/weather?q=" . $city . "&appid=" . $this->appId . $this->callURISuffix);

        if ($response->failed()) {
            $error = $response->body();

            return ['success' => false, 'message' => $error];
        }
        Log::channel('open_weather_map')->info('Calling Weather API.', ['city' => $city]);
        Log::channel('open_weather_map')->debug($response->body());

        $data = $response->json();
        return ['success' => true, 'data' => $data];
    }

    public function currentWeatherById($id)
    {

        $response = Http::get($this->openWeatherDomain . "/data/2.5/weather?id=" . $id . "&appid=" . $this->appId . $this->callURISuffix);

        if ($response->failed()) {
            $error = $response->body();

            return ['success' => false, 'message' => $error];
        }
        Log::channel('open_weather_map')->info('Calling Weather API.', ['id' => $id]);
        Log::channel('open_weather_map')->debug($response->body());

        $data = $response->json();
        return ['success' => true, 'data' => $data];
    }

    public function oneCallApi($latitude, $longitude)
    {
        $response = Http::get($this->openWeatherDomain . "/data/2.5/onecall?lat=" . $latitude . "&lon=" . $longitude . "&exclude=" . implode(",", $this->excludeParts) . "&appid=" . $this->appId . $this->callURISuffix);

        if ($response->failed()) {
            $error = $response->body();

            return ['success' => false, 'message' => $error];
        }

        Log::channel('open_weather_map')->info('Calling One Call API.', ['longitude' => $longitude, 'latitude' => $latitude]);
        Log::channel('open_weather_map')->debug($response->body());

        $data = $response->json();
        return ['success' => true, 'data' => $data];

    }

}
