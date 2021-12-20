<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OpenWeatherMapCity;

class WeatherAlertController extends Controller
{
    public function uiCountriesIndex(Request $request)
    {
        $countries = OpenWeatherMapCity::select('country_name', 'country_code')->distinct()->orderBy('country_name')->get();
        return ['countries' => $countries];
    }

    public function uiCitiesIndex(Request $request)
    {
        $this->validate($request, [
            'country_code' => 'required'
        ]);

        $cities = OpenWeatherMapCity::select('name', 'owmc_id', 'id')->where('country_code', $request->country_code)->orderBy('name')->get();

        return ['cities' => $cities];
    }
}
