<?php

namespace App\Http\Controllers\API\Zapier;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Models\UserDataSource;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AnnotationController extends Controller
{

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

        return ['annotation' => $annotation];
    }

    public function index(Request $request)
    {

        $user = Auth::user();
        $userIdsArray = $this->getAllGroupUserIdsArray();

        $annotationsQuery = "SELECT TempTable.category, TempTable.event_name, TempTable.show_at FROM (";

        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= "SELECT DISTINCT DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` FROM `annotations`";
        if ($request->query('google_analytics_property_id') && $request->query('google_analytics_property_id') !== '*') {
            $annotationsQuery .= " INNER JOIN `annotation_ga_properties` ON `annotation_ga_properties`.`annotation_id` = `annotations`.`id`";
        }
        $annotationsQuery .= " WHERE (";
        if ($request->query('user_id') !== '*' && in_array($request->query('user_id'), $userIdsArray)) {
            $annotationsQuery .= " `annotations`.`user_id` = " . $request->query('user_id');
        } else {
            $annotationsQuery .= " `annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') ";
        }
        $annotationsQuery .= " AND `annotations`.`is_enabled` = 1 ";
        $annotationsQuery .= " )";

        $gAPropertyCriteria = "`uds`.`ga_property_id` IS NULL";

        if ($request->query('google_analytics_property_id') && $request->query('google_analytics_property_id') !== '*') {
            $gaPropertyId = $request->query('google_analytics_property_id');
            $annotationsQuery .= " AND (`annotation_ga_properties`.`google_analytics_property_id` IS NULL OR `annotation_ga_properties`.`google_analytics_property_id` = " . $gaPropertyId . ")";
            $gAPropertyCriteria = "`uds`.`ga_property_id` = $gaPropertyId";
        }

        if ($user->is_ds_web_monitors_enabled && $request->query('show_website_monitoring') == 'false') {
            $annotationsQuery .= " AND annotations.category <> 'Website Monitoring'";
        }

        $addedByArray = [];
        if ($request->query('show_manual_annotations') && $request->query('show_manual_annotations') == 'true') {
            array_push($addedByArray, 'manual');
        }

        if ($request->query('show_csv_annotations') && $request->query('show_csv_annotations') == 'true') {
            array_push($addedByArray, 'csv-upload');
        }

        if ($request->query('show_api_annotations') && $request->query('show_api_annotations') == 'true') {
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
            $annotationsQuery .= "select holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays')";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_retail_marketing_enabled && $request->query('show_retail_marketing_dates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select show_at, retail_marketings.id, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings')";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_weather_alerts_enabled && $request->query('show_weather_alerts') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select alert_date, open_weather_map_alerts.id, open_weather_map_cities.name, description, null, description from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities')";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_google_alerts_enabled && $request->query('show_news_alerts') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select alert_date, google_alerts.id, 'News Alert', title, url, description from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'google_alert_keywords' AND DATE(google_alerts.created_at) > DATE(DATE_ADD(uds.created_at, INTERVAL 1 DAY)) )";
        }
        ////////////////////////////////////////////////////////////////////
        if ($user->is_ds_wordpress_updates_enabled && $request->query('show_wordpress_updates') == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select update_date, wordpress_updates.id, category, event_name, url, description from `wordpress_updates`";
            if (UserDataSource::ofCurrentUser()->where('ds_code', 'wordpress_updates')->where('value', 'last year')->count()) {
                $annotationsQuery .= " where (update_date BETWEEN " . Carbon::now()->subYear()->format('Y-m-d') . " AND " . Carbon::now()->format('Y-m-d') . " )";
            }
        }
        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= ") AS TempTable ORDER BY show_at DESC";

        $annotations = DB::select($annotationsQuery);

        return $annotations;
    }
}
