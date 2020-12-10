<?php

namespace App\Services;


use Illuminate\Support\Facades\Http;

class WeatherAlertService
{
    //
    protected $appId , $openWeatherDomain,$city;
protected $defaultCoordinates;


    public function __construct()
    {
        $this->appId=config('services.weather.App_id');
        $this->openWeatherDomain="https://api.openweathermap.org/data/2.5/";
        $this->city='London';
        $this->defaultCoordinates="lat=33.441792&lon=-94.037689";
    }

    public function weatherApi(){

        $response= Http::get($this->openWeatherDomain."weather?q=".$this->city."&appid=".$this->appId);

        if ($response->failed()) {
            $error = $response->data;

            return ['success' => false, 'message' => $error];
        }
        $data=$response->json();
        return ['success'=>true,'data'=>$data];
    }

    public function oneCallApi(){
        $response= Http::get($this->openWeatherDomain."onecall?".$this->defaultCoordinates."&exclude=hourly,daily&appid=".$this->appId);

        if ($response->failed()) {
            $error = $response->data;

            return ['success' => false, 'message' => $error];
        }
        $data=$response->json();
        return ['success'=>true,'data'=>$data];

    }


}
