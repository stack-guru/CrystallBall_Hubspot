<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Http\Resources\annotation as annotationResource;
use App\Models\Annotation;
use App\Models\AnnotationGaAccount;
use App\Models\UserDataSource;
use App\Services\SendGridService;
use Auth;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Log;

class AnnotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        $annotations = Annotation::where('user_id', Auth::id())->get();
        $resource = new annotationResource($annotations);

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['annotations' => $resource];
    }

    public function show(Annotation $annotation)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['annotation' => $annotation];
    }

    public function extensionIndex(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => [[[]]]];
        }

        $user = Auth::user();
        $userIdsArray = [];

        if($user->user_id){
            // Current user is child, find parent, grab all child users, pluck ids
            $userIdsArray = $user->user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->user->id);
            // Set Current User to parent so that data source configuration which applies are that of parent
            $user = $user->user;
        }else{
            // Current user is parent, grab all child users, pluck ids
            $userIdsArray = $user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->id);
        }

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";

        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= "SELECT DISTINCT DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` FROM `annotations`";
        if ($request->query('google_analytics_account_id') && $request->query('google_analytics_account_id') !== '*') {
            $annotationsQuery .= " INNER JOIN `annotation_ga_accounts` ON `annotation_ga_accounts`.`annotation_id` = `annotations`.`id`";
        }
        $annotationsQuery .= " WHERE (`annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') AND `annotations`.`is_enabled` = 1) ";
        if ($request->query('google_analytics_account_id') && $request->query('google_analytics_account_id') !== '*') {
            $annotationsQuery .= " AND (`annotation_ga_accounts`.`google_analytics_account_id` IS NULL OR `annotation_ga_accounts`.`google_analytics_account_id` = " . $request->query('google_analytics_account_id') . ")";
        }
        $addedByArray = [];
        if ($request->query('show_manual_annotations')) {
            array_push($addedByArray, 'manual');
        }

        if ($request->query('show_csv_annotations')) {
            array_push($addedByArray, 'csv-upload');
        }

        if ($request->query('show_api_annotations')) {
            array_push($addedByArray, 'api');
        }

        $annotationsQuery .= " AND added_by IN ('" . implode("', '", $addedByArray) . "')";
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_algorithm_updates_enabled && $request->query('show_google_algorithm_updates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select update_date AS show_at, google_algorithm_updates.id, category, event_name, NULL as url, description from `google_algorithm_updates`";
            $gAUConf = UserDataSource::where('user_id', $user->id)->where('ds_code', 'google_algorithm_update_dates')->first();
            if ($gAUConf) {
                if ($gAUConf->status != '' && $gAUConf->status != null) {
                    $annotationsQuery .= ' where status = "' . $gAUConf->status . '"';
                }
            }
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_holidays_enabled && $request->query('show_holidays') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_retail_marketing_enabled && $request->query('show_retail_marketing_dates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select show_at, retail_marketings.id, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_weather_alerts_enabled && $request->query('show_weather_alerts') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select alert_date, open_weather_map_alerts.id, open_weather_map_cities.name, description, null, description from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_alerts_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select alert_date, google_alerts.id, category, title, url, description from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'google_alert_keywords'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_wordpress_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select update_date, wordpress_updates.id, category, event_name, url, description from `wordpress_updates`";
        }
        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at ASC";
        $annotations = DB::select($annotationsQuery);

        if (!count($annotations)) {
            return ['annotations' => [[[]]]];
        }

        $fAnnotations = [];

        // If start date is not same as first annotation show date
        // then add blank records to reach the starting point of annotation show date
        $showDate = Carbon::parse($annotations[0]->show_at);
        if ($showDate !== $startDate) {
            $nextShowDate = $startDate;
            $blankCount = $startDate->diffInDays($showDate);
            for ($i = 0; $i < $blankCount; $i++) {
                array_push($fAnnotations, [[]]);
            }
        }

        $combineAnnotations = [];
        for ($i = 0; $i < count($annotations); $i++) {
            $showDate = Carbon::parse($annotations[$i]->show_at);

            if ($i != count($annotations) - 1) {
                if ($annotations[$i]->show_at == $annotations[$i + 1]->show_at) {
                    array_push($combineAnnotations, [
                        "_id" => $annotations[$i]->id,
                        "category" => $annotations[$i]->category,
                        "eventSource" => [
                            "type" => 'annotation',
                            "name" => $annotations[$i]->event_name,
                        ],
                        "url" => $annotations[$i]->url,
                        "description" => $annotations[$i]->description,
                        "title" => "NA",
                        "highlighted" => false,
                        "publishDate" => $showDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                        "type" => "private",
                    ]);
                    continue;
                } else {
                    array_push($combineAnnotations, [
                        "_id" => $annotations[$i]->id,
                        "category" => $annotations[$i]->category,
                        "eventSource" => [
                            "type" => "annotation",
                            "name" => $annotations[$i]->event_name,
                        ],
                        "url" => $annotations[$i]->url,
                        "description" => $annotations[$i]->description,
                        "title" => "NA",
                        "highlighted" => false,
                        "publishDate" => $showDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                        "type" => "private",
                    ]);
                }
            } else {
                array_push($combineAnnotations, [
                    "_id" => $annotations[$i]->id,
                    "category" => $annotations[$i]->category,
                    "eventSource" => [
                        "type" => 'annotation',
                        "name" => $annotations[$i]->event_name,
                    ],
                    "url" => $annotations[$i]->url,
                    "description" => $annotations[$i]->description,
                    "title" => "NA",
                    "highlighted" => false,
                    "publishDate" => $showDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                    "type" => "private",
                ]);
            }
            array_push($fAnnotations, [$combineAnnotations]);
            $combineAnnotations = [];

            // Check if last record or not
            if (($i + 1) !== count($annotations)) {
                $nextShowDate = Carbon::parse($annotations[$i + 1]->show_at);

                // Fill with blank records according to the difference of days between two consecutive annotations
                $blankCount = $showDate->diffInDays($nextShowDate) - 1;
                for ($j = 0; $j < $blankCount; $j++) {
                    array_push($fAnnotations, [[]]);
                }
            }
        }

        $showDate = Carbon::parse($annotations[count($annotations) - 1]->show_at);
        if ($showDate !== $endDate) {
            $nextShowDate = $endDate;
            $blankCount = $showDate->diffInDays($nextShowDate);
            for ($i = 0; $i < $blankCount; $i++) {
                array_push($fAnnotations, [[]]);
            }
        }

        return ['annotations' => $fAnnotations];

    }

    //another method used tp show annotations with selected date(same as method defined above)
    
    public function extensionAnnotationPreview(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            abort(422);
        }

        $user = Auth::user();
        $userIdsArray = [];

        if($user->user_id){
            // Current user is child, find parent, grab all child users, pluck ids
            $userIdsArray = $user->user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->user->id);
            // Set Current User to parent so that data source configuration which applies are that of parent
            $user = $user->user;
        }else{
            // Current user is parent, grab all child users, pluck ids
            $userIdsArray = $user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->id);
        }

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";

        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= "SELECT DISTINCT DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` FROM `annotations`";
        if ($request->query('google_analytics_account_id') && $request->query('google_analytics_account_id') !== '*') {
            $annotationsQuery .= " INNER JOIN `annotation_ga_accounts` ON `annotation_ga_accounts`.`annotation_id` = `annotations`.`id`";
        }
        $annotationsQuery .= " WHERE (`annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') AND `annotations`.`is_enabled` = 1) ";
        if ($request->query('google_analytics_account_id') && $request->query('google_analytics_account_id') !== '*') {
            $annotationsQuery .= " AND (`annotation_ga_accounts`.`google_analytics_account_id` IS NULL OR `annotation_ga_accounts`.`google_analytics_account_id` = " . $request->query('google_analytics_account_id') . ")";
        }
        $addedByArray = [];
        if ($request->query('show_manual_annotations')) {
            array_push($addedByArray, 'manual');
        }

        if ($request->query('show_csv_annotations')) {
            array_push($addedByArray, 'csv-upload');
        }

        if ($request->query('show_api_annotations')) {
            array_push($addedByArray, 'api');
        }

        $annotationsQuery .= " AND added_by IN ('" . implode("', '", $addedByArray) . "')";
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_algorithm_updates_enabled && $request->query('show_google_algorithm_updates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select update_date AS show_at, google_algorithm_updates.id, category, event_name, NULL as url, description from `google_algorithm_updates`";
            $gAUConf = UserDataSource::where('user_id', $user->id)->where('ds_code', 'google_algorithm_update_dates')->first();
            if ($gAUConf) {
                if ($gAUConf->status != '' && $gAUConf->status != null) {
                    $annotationsQuery .= ' where status = "' . $gAUConf->status . '"';
                }
            }
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_holidays_enabled && $request->query('show_holidays') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_retail_marketing_enabled && $request->query('show_retail_marketing_dates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select show_at, retail_marketings.id, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_weather_alerts_enabled && $request->query('show_weather_alerts') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select alert_date, open_weather_map_alerts.id, open_weather_map_cities.name, description, null, description from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_alerts_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select alert_date, google_alerts.id, category, title, url, description from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'google_alert_keywords'";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_wordpress_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select update_date, wordpress_updates.id, category, event_name, url, description from `wordpress_updates`";
        }
        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at ASC";
        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AnnotationRequest $request)
    {
        $user = Auth::user();
        $userId = $user->id;
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->user_id = Auth::id();
        $annotation->added_by = 'api';
        $annotation->save();

        if ($request->google_analytics_account_id !== null && !in_array("", $request->google_analytics_account_id)) {
            foreach ($request->google_analytics_account_id as $gAAId) {
                $aGAA = new AnnotationGaAccount;
                $aGAA->annotation_id = $annotation->id;
                $aGAA->google_analytics_account_id = $gAAId;
                $aGAA->user_id = $userId;
                $aGAA->save();
            }
        } else {
            $aGAA = new AnnotationGaAccount;
            $aGAA->annotation_id = $annotation->id;
            $aGAA->google_analytics_account_id = null;
            $aGAA->user_id = $userId;
            $aGAA->save();
        }

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['annotation' => $annotation];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function update(AnnotationRequest $request, Annotation $annotation)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->fill($request->validated());
        $annotation->show_at = Carbon::parse($request->show_at);
        $annotation->save();

        $aGAAs = $annotation->annotationGaAccounts;
        $oldGAAIds = $aGAAs->pluck('google_analytics_account_id')->toArray();
        $newGAAIds = $request->google_analytics_account_id;

        foreach ($aGAAs as $aGAA) {
            if (!in_array($aGAA->google_analytics_account_id, $newGAAIds)) {
                $aGAA->delete();
            }
        }

        if ($request->has('google_analytics_account_id')) {
            if ($request->google_analytics_account_id !== null && !in_array("", $request->google_analytics_account_id)) {
                foreach ($newGAAIds as $gAAId) {
                    if (!in_array($gAAId, $oldGAAIds)) {
                        $aGAA = new AnnotationGaAccount;
                        $aGAA->annotation_id = $annotation->id;
                        $aGAA->google_analytics_account_id = $gAAId;
                        $aGAA->user_id = $userId;
                        $aGAA->save();
                    }
                }
            } else {
                $aGAA = new AnnotationGaAccount;
                $aGAA->annotation_id = $annotation->id;
                $aGAA->google_analytics_account_id = null;
                $aGAA->user_id = $userId;
                $aGAA->save();
            }
        }

        $annotation->load('annotationGaAccounts');

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['annotation' => $annotation];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Annotation $annotation)
    {
        $user = Auth::user();
        if (!$user->pricePlan->has_api) {
            abort(402);
        }

        if ($annotation->user_id != Auth::id()) {
            abort(404);
        }

        $annotation->delete();

        if ($user->last_api_called_at == null) {
            $sGS = new SendGridService;
            $sGS->addUserToList($user, "14 GAa API users");
        }
        $user->last_api_called_at = new \DateTime;
        $user->save();

        return ['success' => true];
    }

}
