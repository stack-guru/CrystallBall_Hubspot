<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Models\UserDataSource;
use Auth;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;

class AnnotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Annotation::class);

        return view('ui/app');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function create()
    {
        $this->authorize('create', Annotation::class);

        return view('ui/app');
    }

    public function store(AnnotationRequest $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        $userId = $user->id;

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->user_id = $userId;
        $annotation->is_enabled = true;
        $annotation->added_by = 'manual';
        $annotation->save();

        if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
            foreach ($request->google_analytics_property_id as $gAPId) {
                $aGAP = new AnnotationGaProperty;
                $aGAP->annotation_id = $annotation->id;
                $aGAP->google_analytics_property_id = $gAPId;
                $aGAP->user_id = $userId;
                $aGAP->save();
            }
        } else {
            $aGAP = new AnnotationGaProperty;
            $aGAP->annotation_id = $annotation->id;
            $aGAP->google_analytics_property_id = null;
            $aGAP->user_id = $userId;
            $aGAP->save();
        }

        // $user->notify(new NewAnnotationNotification($annotation));
        // event(new \App\Events\NewAnnotationAdded($annotation));
        return ['annotation' => $annotation];
    }

    public function show($id)
    {
        return view('ui/app');
    }

    public function edit($id)
    {
        return view('ui/app');
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
        $this->authorize('update', $annotation);

        $user = Auth::user();
        $userIdsArray = [];
        switch ($user->user_level) {
            case 'admin':
                // Current user is admin, grab all child users, pluck ids
                $userIdsArray = $user->users->pluck('id')->toArray();
                array_push($userIdsArray, $user->id);
                break;
            case 'team':
                // Current user is team, find admin, grab all child users, pluck ids
                $userIdsArray = $user->user->users->pluck('id')->toArray();
                array_push($userIdsArray, $user->user->id);
                break;
        }
        if (!in_array($annotation->user_id, $userIdsArray)) {
            abort(404);
        }

        $annotation->fill($request->validated());
        $annotation->save();

        $aGAPs = $annotation->annotationGaProperties;
        $oldGAPIds = $aGAPs->pluck('google_analytics_property_id')->toArray();
        $newGAPIds = $request->google_analytics_property_id;

        if ($request->has('google_analytics_property_id')) {
            foreach ($aGAPs as $aGAP) {
                if (!in_array($aGAP->google_analytics_property_id, $newGAPIds)) {
                    $aGAP->delete();
                }
            }
        }

        if ($request->has('google_analytics_property_id')) {
            if ($request->google_analytics_property_id !== null && !in_array("", $request->google_analytics_property_id)) {
                foreach ($newGAPIds as $gAPId) {
                    if (!in_array($gAPId, $oldGAPIds)) {
                        $aGAP = new AnnotationGaProperty;
                        $aGAP->annotation_id = $annotation->id;
                        $aGAP->google_analytics_property_id = $gAPId;
                        $aGAP->user_id = $user->id;
                        $aGAP->save();
                    }
                }
            } else {
                if (!in_array("", $oldGAPIds)) {
                    $aGAP = new AnnotationGaProperty;
                    $aGAP->annotation_id = $annotation->id;
                    $aGAP->google_analytics_property_id = null;
                    $aGAP->user_id = $user->id;
                    $aGAP->save();
                }
            }
        }

        $annotation->load('annotationGaProperties');

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
        $this->authorize('delete', $annotation);

        $user = Auth::user();
        $userIdsArray = [];
        switch ($user->user_level) {
            case 'admin':
                // Current user is admin, grab all child users, pluck ids
                $userIdsArray = $user->users->pluck('id')->toArray();
                array_push($userIdsArray, $user->id);
                break;
            case 'team':
                // Current user is team, find admin, grab all child users, pluck ids
                $userIdsArray = $user->user->users->pluck('id')->toArray();
                array_push($userIdsArray, $user->user->id);
                break;
        }

        if (!in_array($annotation->user_id, $userIdsArray)) {
            abort(404);
        }

        $annotation->delete();

        return ["success" => true];
    }

    public function uiIndex(Request $request)
    {
        $this->authorize('viewAny', Annotation::class);

        $user = Auth::user();
        $userIdsArray = [];

        if (!$user->user_id) {
            // Current user is not child, grab all child users, pluck ids
            $userIdsArray = $user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->id);
        } else {
            // Current user is child, find admin, grab all child users, pluck ids
            $userIdsArray = $user->user->users->pluck('id')->toArray();
            array_push($userIdsArray, $user->user->id);
            // Set Current User to Admin so that data source configuration which applies are that of admin
            $user = $user->user;
        }

        $annotationsQuery = "SELECT `TempTable`.*, `annotation_ga_properties`.`id` AS annotation_ga_property_id, `google_analytics_properties`.`name` AS google_analytics_property_name FROM (";
        $annotationsQuery .= "select annotations.is_enabled, annotations.`show_at`, annotations.created_at, `annotations`.`id`, annotations.`category`, annotations.`event_name`, annotations.`url`, annotations.`description`, `users`.`name` AS user_name from `annotations` INNER JOIN `users` ON `users`.`id` = `annotations`.`user_id` where `annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";

        $gAPropertyCriteria = "`uds`.`ga_property_id` IS NULL";

        if ($request->query('annotation_ga_account_id') && $request->query('annotation_ga_account_id') !== '*') {
            $annotationsQuery .= " and annotation_ga_accounts.id = " . $request->query('annotation_ga_account_id');
        }
        if ($user->is_ds_holidays_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, holiday_date AS show_at, holiday_date AS created_at, null, CONCAT(category, \" Holiday\"), event_name, NULL as url, description, 'System' AS user_name from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays')";
        }
        if ($user->is_ds_google_algorithm_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, update_date AS show_at, update_date AS created_at, null, category, event_name, NULL as url, description, 'System' AS user_name from `google_algorithm_updates`";
            $gAUConf = UserDataSource::where('user_id', $user->id)->where('ds_code', 'google_algorithm_update_dates')->first();
            if ($gAUConf) {
                if ($gAUConf->status != '' && $gAUConf->status != null) {
                    $annotationsQuery .= ' where status = "' . $gAUConf->status . '"';
                }
            }
        }
        if ($user->is_ds_retail_marketing_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, show_at, show_at as created_at, null, category, event_name, NULL as url, description, 'System' AS user_name from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings')";
        }
        if ($user->is_ds_weather_alerts_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, alert_date, alert_date as created_at, null, \"Weather Alert\", event, NULL as url, CONCAT( open_weather_map_cities.name, \": \", description), 'System' AS user_name from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where  $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities')";
        }
        if ($user->is_ds_google_alerts_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, alert_date, alert_date as created_at, null, \"Google Alert\", title, url, description, 'System' AS user_name from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'google_alert_keywords')";
        }
        if ($user->is_ds_wordpress_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, update_date, update_date as created_at, null, category, event_name, url, description, 'System' AS user_name from `wordpress_updates`";
            if (UserDataSource::ofCurrentUser()->where('ds_code', 'wordpress_updates')->where('value', 'last year')->count()) {
                $annotationsQuery .= " where YEAR(update_date) < YEAR(CURDATE())";
            }
        }
        $annotationsQuery .= ") AS TempTable";

        $annotationsQuery .= " LEFT JOIN annotation_ga_properties ON TempTable.id = annotation_ga_properties.annotation_id";
        $annotationsQuery .= " LEFT JOIN google_analytics_properties ON annotation_ga_properties.google_analytics_property_id = google_analytics_properties.id";

        if ($request->query('sortBy') == "added") {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sortBy') == "date") {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        } elseif ($request->query('google_account_id')) {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } else {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        }
        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];
    }
    public function uiShow(Annotation $annotation)
    {
        $this->authorize('view', $annotation);

        $user = Auth::user();
        $userIdsArray = [];
        switch ($user->user_level) {
            case 'admin':
                // Current user is admin, grab all child users, pluck ids
                $userIdsArray = $user->users->pluck('id')->toArray();
                array_push($userIdsArray, $user->id);
                break;
            case 'team':
                // Current user is team, find admin, grab all child users, pluck ids
                $userIdsArray = $user->user->users->pluck('id')->toArray();
                array_push($userIdsArray, $user->user->id);
                break;
        }

        if (!in_array($annotation->user_id, $userIdsArray)) {
            abort(403);
        }

        $annotation->load('annotationGaProperties.googleAnalyticsProperty');
        return ['annotation' => $annotation];
    }

    public function upload(Request $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        if (!$user->pricePlan->has_csv_upload) {
            abort(402);
        }

        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
            'date_format' => 'required',
            'google_analytics_property_id' => 'nullable|array',
            'google_analytics_property_id.*' => 'nullable|exists:google_analytics_properties,id',
        ]);

        $filepath = $request->file('csv')->getRealPath();

        $filecontent = file($filepath);
        $headers = str_getcsv($filecontent[0]);

        // Checking if given file contains only required number of columns
        // if (count($headers) !== 5) {
        //     return response()->json(['message' => 'Invalid number of columns'], 422);
        // }

        // Checking if given file contains all required headers
        $kHs = ['category', 'event_name', 'url', 'description', 'show_at'];
        foreach ($kHs as $kH) {
            if (!in_array($kH, $headers)) {
                return response()->json(['message' => 'Incomplete CSV file headers'], 422);
            }
        }

        $user_id = Auth::id();

        $rows = array();
        foreach ($filecontent as $line) {
            if (strlen($line) < (6 + 7)) {
                continue;
            }

            $row = array();
            $values = str_getcsv($line);

            if ($headers !== $values && count($values) == count($headers)) {
                for ($i = 0; $i < count($headers); $i++) {
                    if (in_array($headers[$i], $kHs)) {
                        if ($headers[$i] == 'show_at') {
                            try {
                                $date = Carbon::createFromFormat($request->date_format, $values[$i]);
                                $row['show_at'] = $date->format('Y-m-d');
                            } catch (\Exception$e) {
                                return ['message' => "Please select correct date format according to your CSV file from the list below."];
                            }

                        } else if ($headers[$i] == 'url') {
                            $row['url'] = $values[$i];
                        } else {
                            $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                        }
                    }
                }

                $row['user_id'] = $user_id;
                $row['added_by'] = 'csv-upload';
                array_push($rows, $row);

            }

            if (count($rows) > 99) {
                Annotation::insert($rows);
                $firstInsertId = DB::getPdo()->lastInsertId(); // it returns first generated ID in bulk insert
                $totalNewRows = count($rows);
                $lastInsertId = $firstInsertId + ($totalNewRows - 1);
                if ($request->has('google_analytics_property_id') && !in_array("", $request->google_analytics_property_id)) {
                    foreach ($request->google_analytics_property_id as $googleAnalyticsPropertyId) {
                        $sql = "
                        INSERT INTO annotation_ga_properties (annotation_id, google_analytics_property_id, user_id)
                            SELECT id, $googleAnalyticsPropertyId, user_id FROM annotations
                                WHERE id BETWEEN $firstInsertId AND $lastInsertId
                        ;
                        ";
                        DB::statement($sql);
                    }
                } else {
                    $sql = "
                        INSERT INTO annotation_ga_properties (annotation_id, google_analytics_property_id, user_id)
                            SELECT id, NULL, user_id FROM annotations
                                WHERE id BETWEEN $firstInsertId AND $lastInsertId
                        ;
                        ";
                    DB::statement($sql);
                }

                $rows = array();
            }
        }

        if (count($rows)) {
            Annotation::insert($rows);
            $firstInsertId = DB::getPdo()->lastInsertId(); // it returns first generated ID in bulk insert
            $totalNewRows = count($rows);
            $lastInsertId = $firstInsertId + ($totalNewRows - 1);
            if ($request->has('google_analytics_property_id') && !in_array("", $request->google_analytics_property_id)) {
                foreach ($request->google_analytics_property_id as $googleAnalyticsPropertyId) {
                    $sql = "
                    INSERT INTO annotation_ga_properties (annotation_id, google_analytics_property_id, user_id)
                        SELECT id, $googleAnalyticsPropertyId, user_id FROM annotations
                            WHERE id BETWEEN $firstInsertId AND $lastInsertId
                    ;
                    ";
                    DB::statement($sql);
                }
            } else {
                $sql = "
                    INSERT INTO annotation_ga_properties (annotation_id, google_analytics_property_id, user_id)
                        SELECT id, NULL, user_id FROM annotations
                            WHERE id BETWEEN $firstInsertId AND $lastInsertId
                    ;
                    ";
                DB::statement($sql);
            }
        }

        return ['success' => true];
    }

    public function getCategories()
    {

        $categories = Annotation::select('category')->distinct()->ofCurrentUser()->orderBy('category')->get();
        return ['categories' => $categories];
    }

}
