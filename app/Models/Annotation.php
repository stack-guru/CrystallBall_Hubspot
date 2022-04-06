<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class Annotation extends Model
{

    use HasFactory;

    protected $fillable = [
        'category', 'event_type', 'event_name',
        'url', 'description', 'title', 'show_at', 'type',
        'is_enabled', 'added_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'show_at' => 'date'
    ];

    const SAMPLE_ANNOTATION_EVENT_NAME = 'Sample Annotation';

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function annotationGaAccounts()
    {
        return $this->hasMany('App\Models\AnnotationGaAccount');
    }

    public function annotationGaProperties()
    {
        return $this->hasMany('App\Models\AnnotationGaProperty');
    }

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    public static function allAnnotationsUnionQueryString(User $user, $annotationGAPropertyId = null, array $userIdsArray = [])
    {
        $annotationsQuery = "";
        // SELECT annotations from annotations table
        $annotationsQuery .= "select annotations.added_by, annotations.is_enabled, annotations.`show_at`, annotations.created_at, `annotations`.`id`, annotations.`category`, annotations.`event_name`, annotations.`url`, annotations.`description`, `users`.`name` AS user_name from `annotations` INNER JOIN `users` ON `users`.`id` = `annotations`.`user_id` LEFT JOIN `annotation_ga_properties` ON `annotation_ga_properties`.`annotation_id` = `annotations`.`id` where `annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";

        $gAPropertyCriteria = "`uds`.`ga_property_id` IS NULL";

        // Apply google analytics property filter if the value for filter is provided
        if ($annotationGAPropertyId && $annotationGAPropertyId !== '*') {
            $annotationsQuery .= " and (annotation_ga_properties.google_analytics_property_id IS NULL OR annotation_ga_properties.google_analytics_property_id = " . $annotationGAPropertyId . ") ";
        }
        // Add holiday annotations if it is enabled in user data source
        if ($user->is_ds_holidays_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, holiday_date AS show_at, holiday_date AS created_at, null, CONCAT(category, \" Holiday\"), event_name, NULL as url, description, 'System' AS user_name from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays')";
        }
        // Add google algorithm update annotations if it is enabled in user data source
        if ($user->is_ds_google_algorithm_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, update_date AS show_at, update_date AS created_at, null, category, event_name, NULL as url, description, 'System' AS user_name from `google_algorithm_updates`";
            $gAUConf = UserDataSource::where('user_id', $user->id)->where('ds_code', 'google_algorithm_update_dates')->first();
            if ($gAUConf) {
                if ($gAUConf->status != '' && $gAUConf->status != null) {
                    $annotationsQuery .= ' where status = "' . $gAUConf->status . '"';
                }
            }
        }
        // Add web monitor annotations if it is enabled in user data source
        if ($user->is_ds_web_monitors_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, show_at, created_at, id, category, event_name, url, description, 'System' AS user_name from `web_monitor_annotations` WHERE `web_monitor_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
        }
        // Add retail marketing date annotations if it is enabled in user data source
        if ($user->is_ds_retail_marketing_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, show_at, show_at as created_at, null, category, event_name, NULL as url, description, 'System' AS user_name from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings')";
        }
        // Add weather update annotations if it is enabled in user data source
        if ($user->is_ds_weather_alerts_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, alert_date, alert_date as created_at, null, \"Weather Alert\", event, NULL as url, CONCAT( open_weather_map_cities.name, \": \", description), 'System' AS user_name from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where  $gAPropertyCriteria AND (`owmes`.`user_id` = " . $user->id . " and `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities')";
        }
        // Add google alert annotations if it is enabled in user data source
        if ($user->is_ds_google_alerts_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, alert_date, alert_date as created_at, null, \"News Alert\", title, url, description, 'System' AS user_name from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'google_alert_keywords' AND DATE(google_alerts.created_at) > DATE(DATE_ADD(uds.created_at, INTERVAL 1 DAY)) )";
        }
        // Add wordpress update annotations if it is enabled in user data source
        if ($user->is_ds_wordpress_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select null, 1, update_date, update_date as created_at, null, category, event_name, url, description, 'System' AS user_name from `wordpress_updates`";
            // Check if the user has selected for last year wordpress updates or all time wordpress updates
            if ($annotationGAPropertyId && $annotationGAPropertyId !== '*') {
                $showLastYear = UserDataSource::ofCurrentUser()->where('ga_property_id', $annotationGAPropertyId)->where('ds_code', 'wordpress_updates')->where('value', 'last year')->count();
            } else {
                $showLastYear = UserDataSource::ofCurrentUser()->whereNull('ga_property_id')->where('ds_code', 'wordpress_updates')->where('value', 'last year')->count();
            }
            if ($showLastYear) {
                $annotationsQuery .= " where (update_date BETWEEN '" . Carbon::now()->subYear()->format('Y-m-d') . "' AND '" . Carbon::now()->format('Y-m-d') . "' )";
            }
        }
        return $annotationsQuery;
    }
}
