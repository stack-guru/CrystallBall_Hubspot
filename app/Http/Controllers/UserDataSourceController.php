<?php

namespace App\Http\Controllers;

use App\Events\UserDataSourceUpdatedOrCreated;
use App\Helpers\BitbucketCommitHelper;
use App\Helpers\GitHubCommitHelper;
use App\Http\Requests\StoreKeywordsRequest;
use App\Http\Requests\UserDataSourceRequest;
use App\Models\Keyword;
use App\Models\KeywordConfiguration;
use App\Models\KeywordMeta;
use App\Models\Location;
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
                    'holidays' => UserDataSource::select('id', 'ds_code', 'ds_name', 'country_name', 'ga_property_id')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'holidays')->orderBy('country_name')->get(),
                    'retail_marketings' => UserDataSource::select('id', 'ds_code', 'ds_name', 'retail_marketing_id')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'retail_marketings')->get(),
                    'open_weather_map_cities' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_city_id')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->with('openWeatherMapCity')->where('ds_code', 'open_weather_map_cities')->get(),
                    'open_weather_map_events' => UserDataSource::select('id', 'ds_code', 'ds_name', 'open_weather_map_event')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'open_weather_map_events')->get(),
                    'google_algorithm_update_dates' => UserDataSource::select('id', 'ds_code', 'ds_name', 'status')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'google_algorithm_update_dates')->get(),
                    'google_alert_keywords' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'google_alert_keywords')->get(),
                    'wordpress_updates' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'wordpress_updates')->get(),
                    'keyword_tracking' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'keyword_tracking')->get(),
                    'bitbucket_tracking' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'bitbucket_tracking')->get(),
                    'github_tracking' => UserDataSource::select('id', 'ds_code', 'ds_name', 'value')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'github_tracking')->get(),
                    'shopify_annotation' => UserDataSource::select('id', 'ds_code', 'ds_name', 'shopify_annotation_id')->ofCurrentUser()->where('ga_property_id', $request->query('ga_property_id'))->where('ds_code', 'shopify_annotation')->get(),
                ],
            ];
        }
        return [
            'user_data_sources' => [
                'holidays' => $this->userDataSourceQuery(['country_name'], 'holidays', true, 'country_name'),
                'retail_marketings' =>  $this->userDataSourceQuery(['retail_marketing_id'], 'retail_marketings', true),
                'open_weather_map_cities' => $this->userDataSourceQuery(['open_weather_map_city_id'], 'open_weather_map_cities', true, null, 'openWeatherMapCity'),
                'open_weather_map_events' => $this->userDataSourceQuery(['open_weather_map_event'], 'open_weather_map_events'),
                'google_algorithm_update_dates' => $this->userDataSourceQuery(['status'], 'google_algorithm_update_dates', true),
                'google_alert_keywords' => $this->userDataSourceQuery(['value'], 'google_alert_keywords', true),
                'wordpress_updates' => $this->userDataSourceQuery(['value'], 'wordpress_updates', true),
                'keyword_tracking' => $this->userDataSourceQuery(['value'], 'keyword_tracking'),
                'bitbucket_tracking' => $this->userDataSourceQuery(['value'], 'bitbucket_tracking', true),
                'github_tracking' => $this->userDataSourceQuery(['value'], 'github_tracking', true),
                'facebook_tracking' => $this->userDataSourceQuery(['value'], 'facebook_tracking', true),
                'twitter_tracking' => $this->userDataSourceQuery(['value'], 'twitter_tracking', true),
                'instagram_tracking' => $this->userDataSourceQuery(['value'], 'instagram_tracking', true),
                'shopify_annotation' => $this->userDataSourceQuery(['shopify_annotation_id'], 'shopify_annotation'),
            ],
        ];
    }
    private function userDataSourceQuery ($addSelect, $where, $join = null, $orderBy = null, $with = null) {
    
        $query = UserDataSource::select(array_merge(['user_data_sources.id', 'ds_code', 'ds_name'], $addSelect))
        ->ofCurrentUser()
        ->when($join, function ($q) {
            $q->leftjoin('google_analytics_properties', 'google_analytics_properties.id', 'user_data_sources.ga_property_id');
            $q->addSelect('google_analytics_properties.name AS ga_property_name');
        })
        ->where('ds_code', $where)
        ->when($orderBy, function ($q) use ($orderBy) {
            $q->orderBy($orderBy);
        })
        ->when($with, function ($q) use ($with) {
            $q->with($with);
        })
        ->get();
    
        return $query;
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
        if ($request->ds_code == 'bitbucket_tracking') {
            $dsBitbucketTracking = UserDataSource::where('ds_code', 'bitbucket_tracking')->where('user_id', $user->id)->count();
            $pricePlan = $user->pricePlan;
            if (($pricePlan->bitbucket_credits_count < $dsBitbucketTracking || $pricePlan->bitbucket_credits_count == $dsBitbucketTracking) && $pricePlan->bitbucket_credits_count != 0) {
                // return response(['message' => "You have reached maximum number (" . $dsCityCount . ") of allowed (" . $pricePlan->owm_city_count . ") cities."], 422);
                return response(['message' => "You have reached this plan's limit. Please upgrade your plan."], 422);
            }
        }

        if ($request->ds_code == 'github_tracking') {
            $dsGithubTracking = UserDataSource::where('ds_code', 'github_tracking')->where('user_id', $user->id)->count();
            $pricePlan = $user->pricePlan;
            if (($pricePlan->github_credits_count < $dsGithubTracking || $pricePlan->github_credits_count == $dsGithubTracking) && $pricePlan->github_credits_count != 0) {
                // return response(['message' => "You have reached maximum number (" . $dsCityCount . ") of allowed (" . $pricePlan->owm_city_count . ") cities."], 422);
                return response(['message' => "You have reached this plan's limit. Please upgrade your plan."], 422);
            }
        }
        if ($request->ds_code == 'holidays') {
            $holidays = UserDataSource::where('ds_code', 'holidays')->where('user_id', $user->id)->count();
            $pricePlan = $user->pricePlan;
            if(($pricePlan->holiday_credits_count < $holidays || $pricePlan->holiday_credits_count == $holidays) && $pricePlan->holiday_credits_count == -1) {
                return response(['message' => "You are not allowed to add holidays. Please upgrade your plan."], 422);
            } elseif (($pricePlan->holiday_credits_count < $holidays || $pricePlan->holiday_credits_count == $holidays) && $pricePlan->holiday_credits_count != 0) {
                return response(['message' => "You have reached this plan's limit. Please upgrade your plan."], 422);
            }
        }

        $userDataSource = new UserDataSource;
        $userDataSource->fill($request->validated());
        $userDataSource->user_id = $user->id;
        $userDataSource->save();
        $userDataSource->load('openWeatherMapCity');
        if ($request->ds_code == 'bitbucket_tracking') {
            BitbucketCommitHelper::fetch($userDataSource);
        }

        if ($request->ds_code == 'github_tracking') {
            GitHubCommitHelper::fetch($userDataSource);
        }
        return ['user_data_source' => $userDataSource];
    }


    // for checkall
    public function storeAll(Request $request) {
        $data = $request->input('data');
        $ga_property_id = $request->input('ga_property_id');

        $result = [];
        foreach($data as $dt) {

            $user = Auth::user();

            $userDataSource = new UserDataSource;
            $dt = (object) $dt;
            $userDataSource->country_name = $dt->country_name;
            $userDataSource->ds_code = $dt->code;
            $userDataSource->ds_name = $dt->name;
            if(@$dt->open_weather_map_city_id) {
                $userDataSource->open_weather_map_city_id = $dt->open_weather_map_city_id;
            }
            if(@$dt->retail_marketing_id) {
                $userDataSource->retail_marketing_id = $dt->retail_marketing_id;
            }
            $userDataSource->ga_property_id = $ga_property_id;
            $userDataSource->is_enabled = 1;
            $userDataSource->user_id = $user->id;
            $userDataSource->save();
            $userDataSource->load('openWeatherMapCity');

            $result[] = $userDataSource;
        }
        return $result;
    }

    public function deleteAll(Request $request)
    {

        $userDataSourceIds = $request->input('userDataSourceIds');
        UserDataSource::whereIn('id', $userDataSourceIds)->delete();

        return ['success' => true];
    }

    /**
     * Update a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserDataSource $userDataSource)
    {
        $input = $request->all();
        $userDataSource->ga_property_id = $input['gaPropertyId'];
        $userDataSource->save();

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
        if (!$user_data_source) {
            $user_data_source = new UserDataSource();
            $user_data_source->user_id = Auth::id();
            $user_data_source->ds_code = 'keyword_tracking';
            $user_data_source->ds_name = 'KeywordTracking';
            $user_data_source->save();
        }

        $user_data_source->ga_property_id = $request->gaPropertyId;
        $user_data_source->save();

        // loop through data for each keyword
        foreach ($request->keywords as $keyword_loop) {
            $keyword = Keyword::where('keyword', $keyword_loop['keyword'])->where('user_data_source_id', $user_data_source->id)->first();
            // save keyword if not exist
            if(!$keyword) {
                $keyword = new Keyword();
                $keyword->keyword = $keyword_loop['keyword'];
                $keyword->user_data_source_id = $user_data_source->id;
                $keyword->save();
            }

            // save configurations
            $url = $request->url;
            $language = $request->lang;
            $ranking_direction = $request->ranking_direction;
            $ranking_places_changed = $request->ranking_places;
            $is_url_competitors = $request->is_url_competitors;
            // check if locations are more or search engines are more
            if (count($request->search_engine) <= count($request->location)) {
                foreach ($request->search_engine as $search_engine_loop) {
                    foreach ($request->location as $location) {
                        $search_engine = $search_engine_loop['value'] ?? '';
                        $location_code = $location['value'] ?? '';
                        $configuration_id = $this->saveKeywordConfiguration($url, $search_engine, $location_code, $language, $ranking_direction, $ranking_places_changed, $is_url_competitors);
                        // doing pivot entry
                        $keyword_meta = KeywordMeta::where('keyword_id', $keyword->id)->where('keyword_configuration_id', $configuration_id)->first();
                        if (!$keyword_meta) {
                            $keyword_meta = new KeywordMeta();
                            $keyword_meta->keyword_id = $keyword->id;
                            $keyword_meta->keyword_configuration_id = $configuration_id;
                            $keyword_meta->save();
                        }
                    }
                }
            } elseif (count($request->location) < count($request->search_engine)) {
                foreach ($request->location as $location) {
                    foreach ($request->search_engine as $search_engine_loop) {
                        $search_engine = $search_engine_loop['value'] ?? '';
                        $location_code = $location['value'] ?? '';
                        $configuration_id = $this->saveKeywordConfiguration($url, $search_engine, $location_code, $language, $ranking_direction, $ranking_places_changed, $is_url_competitors);
                        // doing pivot entry
                        $keyword_meta = KeywordMeta::where('keyword_id', $keyword->id)->where('keyword_configuration_id', $configuration_id)->first();
                        if (!$keyword_meta) {
                            $keyword_meta = new KeywordMeta();
                            $keyword_meta->keyword_id = $keyword->id;
                            $keyword_meta->keyword_configuration_id = $configuration_id;
                            $keyword_meta->save();
                        }
                    }
                }
            }
        }

        // get and store dfs task id
        UserDataSourceUpdatedOrCreated::dispatch($user_data_source);
    }

    private function saveKeywordConfiguration($url, $search_engine, $location_code, $language, $ranking_direction, $ranking_places_changed, $is_url_competitors)
    {
        if ($is_url_competitors == 'true') {
            $is_url_competitors = true;
        } else if ($is_url_competitors == 'false') {
            $is_url_competitors = false;
        }
        // check if already exists
        $configuration = KeywordConfiguration::where([
            'url' => $url,
            'search_engine' => $search_engine,
            'location_code' => $location_code,
            'language' => $language,
            'ranking_direction' => $ranking_direction,
            'ranking_places_changed' => $ranking_places_changed,
            'is_url_competitors' => $is_url_competitors,
        ])->first();
        // if it does not exist just create it
        if ($configuration) {
            return $configuration->id;
        }
        // if it exists just reutrn the id
        else {
            $configuration = new KeywordConfiguration();
            $configuration->url = $url;
            $configuration->search_engine = $search_engine;
            $configuration->location_code = $location_code;
            $configuration->language = $language;
            $configuration->ranking_direction = $ranking_direction;
            $configuration->ranking_places_changed = $ranking_places_changed;
            $configuration->is_url_competitors = $is_url_competitors;

            $configuration->save();
            return $configuration->id;
        }
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
        $data_source = UserDataSource::where('user_id', Auth::id())->where('ds_code', 'keyword_tracking')->first();
        if ($data_source) {
            $keywords = Keyword::with('configurations')->select('id', 'keyword')->where('user_data_source_id', $data_source->id)->get();
            foreach ($keywords as $key => $keyword) {
                if ($keyword->configurations->count() > 0) {
                    foreach ($keyword->configurations as $conf) {
                        $location = Location::where('location_code', $conf->location_code)->first();
                        $conf->location_name = $location->location_name;
                    }
                }
            }
            return [
                'keywords' => $keywords
            ];
        } else {
            return [
                'keywords' => []
            ];
        }
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
            'keyword_configuration_id' => 'required',
            'keyword_id' => 'required'
        ]);

        try {
            DB::beginTransaction();
            $keyword_configuration = KeywordConfiguration::find($request->keyword_configuration_id);
            $keyword = Keyword::with('user_data_source')->find($request->keyword_id);
            if ($keyword && $keyword_configuration) {
                $user_data_source = $keyword->user_data_source;
                if ($user_data_source->user_id == Auth::id()) {
                    // delete link between user keyword and configuration
                    // but do not delete the configuraiton it might be used later
                    $meta = KeywordMeta::where('keyword_id', $keyword->id)->where('keyword_configuration_id', $keyword_configuration->id)->first();
                    if ($meta) {
                        $meta->delete();
                    }
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function getKeywordTrackingDetailsForKeyword(Request $request)
    {
        $request->validate([
            'keyword_configuration_id' => 'required',
            'keyword_id' => 'required'
        ]);

        $keyword = Keyword::find($request->keyword_id);
        $keyword_configuration = KeywordConfiguration::find($request->keyword_configuration_id);

        if ($keyword && $keyword_configuration) {
            $user_data_source = $keyword->user_data_source;
            if ($user_data_source->user_id == Auth::id()) {
                $location_name = Location::where('location_code', $keyword_configuration->location_code)->first()->location_name;
                return response()->json([
                    'keyword_id' => $keyword->id,
                    'keyword_configuration_id' => $keyword_configuration->id,
                    'keyword' => $keyword->keyword,
                    'is_url_competitors' => $keyword_configuration->is_url_competitors,
                    'url' => $keyword_configuration->url,
                    'search_engine' => $keyword_configuration->search_engine,
                    'location' => $keyword_configuration->location_code,
                    'location_name' => $location_name,
                    'language' => $keyword_configuration->language,
                    'ranking_direction' => $keyword_configuration->ranking_direction,
                    'ranking_places_changed' => $keyword_configuration->ranking_places_changed,
                ]);
            }
        }

        return response()->json('Keyword details not found.', 500);
    }

    public function updateKeywordTrackingDetailsForKeyword(Request $request)
    {
        $request->validate([
            'keyword_id' => 'required',
            'keyword_configuration_id' => 'required',
            'url' => 'required',
            'search_engine' => 'required',
            'location' => 'required',
            'ranking_direction' => 'required',
            'ranking_places' => 'required',
            'is_url_competitors' => 'required'
        ]);

        $keyword = Keyword::find($request->keyword_id);
        $keyword_configuration = KeywordConfiguration::find($request->keyword_configuration_id);
        $pivot = KeywordMeta::where('keyword_id', $keyword->id)->where('keyword_configuration_id', $keyword_configuration->id)->first();
        if ($pivot) {
            $pivot->delete();
        }

        if ($keyword) {
            $user_data_source = $keyword->user_data_source;
            if ($user_data_source->user_id == Auth::id()) {
                $configuration_id = $this->saveKeywordConfiguration($request->url, $request->search_engine, $request->location, 'en', $request->ranking_direction, $request->ranking_places, $request->is_url_competitors);
                // doing pivot entry
                $keyword_meta = new KeywordMeta();
                $keyword_meta->keyword_id = $keyword->id;
                $keyword_meta->keyword_configuration_id = $configuration_id;
                $keyword_meta->save();
            }
        }
    }
}
