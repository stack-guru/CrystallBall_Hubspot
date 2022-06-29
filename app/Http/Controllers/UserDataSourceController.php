<?php

namespace App\Http\Controllers;

use App\Events\UserDataSourceUpdatedOrCreated;
use App\Http\Requests\StoreKeywordsRequest;
use App\Http\Requests\UserDataSourceRequest;
use App\Models\Keyword;
use App\Models\KeywordConfiguration;
use App\Models\KeywordMeta;
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
     * @param \Illuminate\Http\Request $request
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
     * @param \App\Models\UserDataSource $userDataSource
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
     * @param mixed $request
     * @return void
     */
    public function saveDFSkeywordsforTracking(StoreKeywordsRequest $request)
    {
        // dd($request->all());
        // get user data source 
        $user_data_source = UserDataSource::where('user_id', Auth::id())->where('ds_code', 'keyword_tracking')->where('ds_name', 'KeywordTracking')->first();
        // create user data source if not exist
        if(!$user_data_source){
            $user_data_source = new UserDataSource();
            $user_data_source->user_id = Auth::id();
            $user_data_source->ds_code = 'keyword_tracking';
            $user_data_source->ds_name = 'KeywordTracking';
            $user_data_source->save();
        }

        // loop through data for each keyword
        foreach ($request->keywords as $keyword_loop) {
            // save keyword
            $keyword = new Keyword();
            $keyword->keyword = $keyword_loop['keyword'];
            $keyword->user_data_source_id = $user_data_source->id;
            $keyword->save();

            // save configurations
            $url = $request->url;
            $language = $request->lang;
            $ranking_direction = $request->ranking_direction;
            $ranking_places_changed = $request->ranking_places;
            $is_url_competitors = $request->is_url_competitors;
            // check if locations are more or languages are more
            if(count($request->search_engine) >= count($request->location)){
                for($i=0; $i < count($request->search_engine); $i++){
                    $search_engine = $request->search_engine[$i]['value'] ?? '';
                    $location_code = $request->location[$i]['value'] ?? '';
                    $configuration_id = $this->saveKeywordConfiguration($url, $search_engine, $location_code, $language, $ranking_direction, $ranking_places_changed, $is_url_competitors);
                    // doing pivot entry
                    $keyword_meta = new KeywordMeta();
                    $keyword_meta->keyword_id = $keyword->id;
                    $keyword_meta->keyword_configuration_id = $configuration_id;
                    $keyword_meta->save();
                }
            }
            elseif(count($request->location) > count($request->search_engine)){
                for($i=0; $i < count($request->location); $i++){
                    $search_engine = $request->search_engine[$i];
                    $location_code = $request->location[$i] ?? '';
                    $configuration_id = $this->saveKeywordConfiguration($url, $search_engine, $location_code, $language, $ranking_direction, $ranking_places_changed, $is_url_competitors);
                    // doing pivot entry
                    $keyword_meta = new KeywordMeta();
                    $keyword_meta->keyword_id = $keyword->id;
                    $keyword_meta->keyword_configuration_id = $configuration_id;
                    $keyword_meta->save();
                }
            }
            

        }

        // get and store dfs task id
        UserDataSourceUpdatedOrCreated::dispatch($user_data_source);
    }

    private function saveKeywordConfiguration($url, $search_engine, $location_code, $language, $ranking_direction, $ranking_places_changed, $is_url_competitors){
        $configuration = new KeywordConfiguration();
        $configuration->url = $url;
        $configuration->search_engine = $search_engine;
        $configuration->location_code = $location_code;
        $configuration->language = $language;
        $configuration->ranking_direction = $ranking_direction;
        $configuration->ranking_places_changed = $ranking_places_changed;
        if($is_url_competitors == 'true'){
            $configuration->is_url_competitors = true;
        }
        else if($is_url_competitors == 'false'){
            $configuration->is_url_competitors = false;
        }
        $configuration->save();
        return $configuration->id;
    }

    private function saveKeywords($keywords, $data_source)
    {
        foreach ($keywords as $keyword) {
            if (!isset($keyword['user_data_source_id'])) {
                $where = [
                    'user_data_source_id' => $data_source->id,
                    'keyword' => $keyword['keyword'],
                ];
                $update = [
                    'user_data_source_id' => $data_source->id,
                    'keyword' => $keyword['keyword'],
                ];
                Keyword::updateOrCreate($where, $update);
            }
        }
    }

    /**
     * getDFSkeywordsforTracking
     *
     * @param mixed $request
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
     * @param mixed $request
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
