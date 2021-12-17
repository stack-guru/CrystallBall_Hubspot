<?php

namespace App\Http\Controllers\API\ChromeExtension;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use App\Models\AnnotationGaProperty;
use App\Models\UserDataSource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AnnotationController extends Controller
{

    public function index(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            return ['annotations' => [[[]]]];
        }

        $user = Auth::user();
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

        $annotationsQuery = "SELECT TempTable.* FROM (";

        ////////////////////////////////////////////////////////////////////
        $annotationsQuery .= "SELECT DISTINCT DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` FROM `annotations`";
        if ($request->query('google_analytics_property_id') && $request->query('google_analytics_property_id') !== '*') {
            $annotationsQuery .= " INNER JOIN `annotation_ga_properties` ON `annotation_ga_properties`.`annotation_id` = `annotations`.`id`";
        }

        $annotationsQuery .= " WHERE (";
        if ($request->query('user_id') && $request->query('user_id') !== '*' && in_array($request->query('user_id'), $userIdsArray)) {
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

        $addedByArray = ['zapier'];
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
        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at ASC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

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
        // Iterating through all annotations and generate an array
        for ($i = 0; $i < count($annotations); $i++) {
            $showDate = Carbon::parse($annotations[$i]->show_at);

            // If current annotation is not last annotation
            if ($i != count($annotations) - 1) {
                // If current and next annotation is of same date
                if ($annotations[$i]->show_at == $annotations[$i + 1]->show_at) {
                    // Add only 1 annotation to a date if user is not allowed to use chrome extension api
                    if (!$user->pricePlan->has_chrome_extension && $user->created_at > Carbon::parse('2021-11-04') && count($combineAnnotations)) {
                    } else {
                        array_push($combineAnnotations, $this->formatAnnotation($annotations[$i], $showDate, $user));
                    }
                    // keep adding annotations in combinedAnnotations array if next annotation
                    // is of same date
                    continue;
                } else {
                    // If current and next annotation is of different date

                    // Add only 1 annotation to a date if user is not allowed to use chrome extension api
                    if (!$user->pricePlan->has_chrome_extension && $user->created_at > Carbon::parse('2021-11-04') && count($combineAnnotations)) {
                    } else {
                        array_push($combineAnnotations, $this->formatAnnotation($annotations[$i], $showDate, $user));
                    }
                }
            } else {
                // If current annotation is last annotation

                // Add only 1 annotation to a date if user is not allowed to use chrome extension api
                if (!$user->pricePlan->has_chrome_extension && $user->created_at > Carbon::parse('2021-11-04') && count($combineAnnotations)) {
                } else {
                    array_push($combineAnnotations, $this->formatAnnotation($annotations[$i], $showDate, $user));
                }
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
        // If annotations are not ending on the request end date then add blank records for 
        // each date till end date
        if ($showDate !== $endDate) {
            $nextShowDate = $endDate;
            $blankCount = $showDate->diffInDays($nextShowDate);
            for ($i = 0; $i < $blankCount; $i++) {
                array_push($fAnnotations, [[]]);
            }
        }

        return [
            'annotations' => $fAnnotations,
            'user_annotation_color' => $user->userAnnotationColor,
        ];
    }

    //another method used tp show annotations with selected date(same as method defined above)

    public function extensionAnnotationPreview(Request $request)
    {
        if (!$request->has('startDate') && !$request->has('endDate')) {
            abort(422);
        }

        $user = Auth::user();
        if (!$user->pricePlan->has_chrome_extension && $user->created_at > Carbon::parse('2021-11-04')) {
            return [
                'annotations' => [
                    [
                        "category" => "Upgrade your plan",
                        "event_name" => "To see the annotations",
                        "show_at" => Carbon::now()->format('Y-m-d')
                    ]
                ],
                'user_annotation_color' => $user->userAnnotationColor,
            ];
        }
        $userIdsArray = $user->getAllGroupUserIdsArray();

        $startDate = Carbon::parse($request->query('startDate'));
        $endDate = Carbon::parse($request->query('endDate'));

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

        $addedByArray = ['zapier'];
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
        $annotationsQuery .= ") AS TempTable WHERE DATE(`show_at`) BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "' ORDER BY show_at DESC";

        // Add limit for annotations if the price plan is limited in annotations count
        if ($user->pricePlan->annotations_count > 0) {
            $annotationsQuery .= " LIMIT " . $user->pricePlan->annotations_count;
        }

        $annotations = DB::select($annotationsQuery);

        return [
            'annotations' => $annotations,
            'user_annotation_color' => $user->userAnnotationColor,

        ];
    }

    public function store(AnnotationRequest $request)
    {
        $this->authorize('create', Annotation::class);

        $user = Auth::user();
        if ((!$user->pricePlan->has_chrome_extension && $user->created_at > Carbon::parse('2021-11-04')) || $user->isPricePlanAnnotationLimitReached(true)) {
            abort(402);
        }
        $userId = $user->id;

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->show_at = $request->show_at ? Carbon::parse($request->show_at) : Carbon::now();
        $annotation->user_id = $userId;
        $annotation->is_enabled = true;
        $annotation->added_by = 'manual';
        $annotation->save();
        event(new \App\Events\AnnotationCreated($annotation));

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

    private function formatAnnotation($annotation, $publishDate, $user): array
    {

        // Hiding annotations if user is not allowed to use chrome extension
        if (!$user->pricePlan->has_chrome_extension && $user->created_at > Carbon::parse('2021-11-04')) {
            return [
                "_id" => $annotation->id,
                "category" => 'Upgrade your plan',
                "eventSource" => [
                    "type" => "annotation",
                    "name" => 'To see the annotation',
                ],
                "url" => route('settings.price-plans'),
                "description" => 'The Chrome extension is not available in ' . $user->pricePlan->name . ' plan',
                "title" => "Upgrade your plan",
                "highlighted" => false,
                "publishDate" => $publishDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                "type" => "private",
            ];
        } else {
            return [
                "_id" => $annotation->id,
                "category" => $annotation->category,
                "eventSource" => [
                    "type" => "annotation",
                    "name" => $annotation->event_name,
                ],
                "url" => $annotation->url,
                "description" => $annotation->description,
                "title" => "NA",
                "highlighted" => false,
                "publishDate" => $publishDate->format('Y-m-d\TH:i:s\Z'), //"2020-08-30T00:00:00.000Z"
                "type" => "private",
            ];
        }
    }
}
