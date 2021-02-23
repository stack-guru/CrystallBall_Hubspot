<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDataSourceRequest;
use App\Models\UserDataSource;
use Auth;
use Illuminate\Http\Request;

class UserDataSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        return [
            'user_data_sources' => [
                'holidays' => UserDataSource::select('id', 'ds_code', 'ds_name', 'country_name')->ofCurrentUser()->where('ds_code', 'holidays')->orderBy('country_name')->get(),
                'retail_marketings' => UserDataSource::select('id', 'ds_code', 'ds_name', 'retail_marketing_id')->ofCurrentUser()->where('ds_code', 'retail_marketings')->get(),
                'open_weather_map_cities' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_city_id')->ofCurrentUser()->with('openWeatherMapCity')->where('ds_code', 'open_weather_map_cities')->get(),
                'open_weather_map_events' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_event')->ofCurrentUser()->where('ds_code', 'open_weather_map_events')->get(),

            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserDataSourceRequest $request)
    {

        $userDataSource = new UserDataSource;
        $userDataSource->fill($request->validated());
        $userDataSource->user_id = Auth::id();
        $userDataSource->save();
        $userDataSource->load('openWeatherMapCity');

        return ['user_data_source' => $userDataSource];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserDataSource  $userDataSource
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserDataSource $userDataSource)
    {
        
        if ($userDataSource->user_id !== Auth::id()) {
            abort(404);
        }

        $userDataSource->delete();

        return ['success' => true, 'data_source' => $userDataSource];
    }
}
