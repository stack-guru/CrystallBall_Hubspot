<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKeywordsRequest;
use App\Http\Requests\UserDataSourceRequest;
use App\Models\Keyword;
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
                    'keyword_tracking' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'keyword_tracking')->get(),
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
                'keyword_tracking' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'keyword_tracking')->get(),
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
            abort(404, "Unable to find data source with the given id.");
        }

        $userDataSource->delete();

        return ['success' => true, 'data_source' => $userDataSource];
    }

    /**
     * saveDFSkeywordsforTracking
     *
     * @param  mixed $request
     * @return void
     */
    public function saveDFSkeywordsforTracking(StoreKeywordsRequest $request)
    {
        DB::beginTransaction();
        try {
            $data_source = UserDataSource::where('user_id', Auth::id())->where('ds_code', 'keyword_tracking')->first();
            if (!$data_source) {
                $data_source = new UserDataSource();
                $data_source->ds_code = 'keyword_tracking';
                $data_source->ds_name = "KeywordTracking";
                $data_source->user_id = Auth::id();
            }
            $data_source->is_enabled = true;
            $data_source->url = $request->url;
            $data_source->search_engine = $request->search_engine;
            $data_source->location = $request->location;
            $data_source->lang = $request->lang;
            $data_source->ranking_direction = $request->ranking_direction;
            $data_source->ranking_places = $request->ranking_places;
            $data_source->save();
            $this->saveKeywords($request->keywords, $data_source);
            DB::commit();
            return $data_source;
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
        }
    }

    private function saveKeywords($keywords, $data_source)
    {
        foreach ($keywords as $keyword) {
            if (!isset($keyword['user_data_source_id'])) {
                Keyword::create([
                    'keyword' => $keyword['keyword'],
                    'user_data_source_id' => $data_source->id
                ]);
            }
        }
    }

    /**
     * getDFSkeywordsforTracking
     *
     * @param  mixed $request
     * @return void
     */
    public function getDFSkeywordsforTracking()
    {
        $data_source = UserDataSource::with('keywords')->where('user_id', Auth::id())->where('ds_code', 'keyword_tracking')->first();
        return $data_source;
    }

    /**
     * deleteDFSkeywordforTracking
     *
     * @param  mixed $request
     * @return void
     */
    public function deleteDFSkeywordforTracking(Request $request)
    {
        $request->validate([
            'keyword_id' => 'required',
        ]);

        try {
            DB::beginTransaction();
            $keyword_data_source = UserDataSource::with('keywords')->where('user_id', Auth::id())->where('ds_code', 'keyword_tracking')->first();
            $keyword_data_source->keywords()->where('id', $request->keyword_id)->first()->delete();
            DB::commit();
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
