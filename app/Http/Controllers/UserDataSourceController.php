<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDataSourceRequest;
use App\Models\UserDataSource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserDataSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->query('ga_property_id')) {
            return [
                'user_data_sources' => [
                    'holidays' => UserDataSource::select('id', 'ds_code', 'ds_name', 'country_name')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'holidays')->orderBy('country_name')->get(),
                    'retail_marketings' => UserDataSource::select('id', 'ds_code', 'ds_name', 'retail_marketing_id')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'retail_marketings')->get(),
                    'open_weather_map_cities' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_city_id')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->with('openWeatherMapCity')->where('ds_code', 'open_weather_map_cities')->get(),
                    'open_weather_map_events' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_event')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'open_weather_map_events')->get(),
                    'google_algorithm_update_dates' => UserDataSource::select('id', 'ds_code', 'ds_name', 'status')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'google_algorithm_update_dates')->get(),
                    'google_alert_keywords' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'google_alert_keywords')->get(),
                    'wordpress_updates' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'wordpress_updates')->get(),
                ],
            ];
        }
        return [
            'user_data_sources' => [
                'holidays' => UserDataSource::select('id', 'ds_code', 'ds_name', 'country_name')->ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'holidays')->orderBy('country_name')->get(),
                'retail_marketings' => UserDataSource::select('id', 'ds_code', 'ds_name', 'retail_marketing_id')->ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'retail_marketings')->get(),
                'open_weather_map_cities' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_city_id')->ofCurrentUser()->whereNull('ga_property_id')->with('openWeatherMapCity')->where('ds_code', 'open_weather_map_cities')->get(),
                'open_weather_map_events' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_event')->ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'open_weather_map_events')->get(),
                'google_algorithm_update_dates' => UserDataSource::select('id', 'ds_code', 'ds_name', 'status')->ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'google_algorithm_update_dates')->get(),
                'google_alert_keywords' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'google_alert_keywords')->get(),
                'wordpress_updates' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'wordpress_updates')->get(),
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
        $user = Auth::user();

        if ($request->ds_code == 'google_algorithm_update_dates') {
            DB::statement("DELETE FROM user_data_sources WHERE ds_code = ? AND user_id = ?", ['google_algorithm_update_dates', Auth::id()]);
        }
        if ($request->ds_code == 'open_weather_map_cities') {
            $dsCityCount = UserDataSource::where('ds_code', 'open_weather_map_cities')->where('user_id', $user->id)->count();
            $pricePlan = $user->pricePlan;
            if (($pricePlan->owm_city_count < $dsCityCount || $pricePlan->owm_city_count == $dsCityCount) && $pricePlan->owm_city_count != 0) {
                // return response(['message' => "You have reached maximum number (" . $dsCityCount . ") of allowed (" . $pricePlan->owm_city_count . ") cities."], 422);
                return response(['message' => "You have reached maximum number of allowed cities."], 422);
            }
        }
        if ($request->ds_code == 'google_alert_keywords') {
            $dsGAKeywordCount = UserDataSource::where('ds_code', 'google_alert_keywords')->where('user_id', $user->id)->count();
            $pricePlan = $user->pricePlan;
            if (($pricePlan->google_alert_keyword_count < $dsGAKeywordCount || $pricePlan->google_alert_keyword_count == $dsGAKeywordCount) && $pricePlan->google_alert_keyword_count != 0) {
                // return response(['message' => "You have reached maximum number (" . $dsGAKeywordCount . ") of allowed (" . $pricePlan->google_alert_keyword_count . ") cities."], 422);
                return response(['message' => "You have reached maximum number of allowed keywords."], 422);
            }
        }

        $userDataSource = new UserDataSource;
        $userDataSource->fill($request->validated());
        $userDataSource->user_id = $user->id;
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
