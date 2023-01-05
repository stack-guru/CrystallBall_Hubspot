<?php

namespace App\Helpers;

use App\Models\UserDataSource;
use Illuminate\Support\Carbon;

class AnnotationQueryHelper
{
    public static function googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId = '*')
    {
        $gAPropertyCriteria = "`uds`.`ga_property_id` IS NULL";
        if ($googleAnalyticsPropertyId && $googleAnalyticsPropertyId !== '*') {
            $gAPropertyCriteria = "(`uds`.`ga_property_id` = $googleAnalyticsPropertyId OR $gAPropertyCriteria)";
        }

        return $gAPropertyCriteria;
    }

    public static function userAnnotationsQuery($user, $userIdsArray, $googleAnalyticsPropertyId = '*', $userId = '*', $showWebMonitoring = 'false', $showManualAnnotations = 'false', $showCSVAnnotations = 'false', $showAPIAnnotations = 'false')
    {
        $annotationsQuery = "";
        $annotationsQuery .= "SELECT DISTINCT DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` FROM `annotations`";
        if ($googleAnalyticsPropertyId && $googleAnalyticsPropertyId !== '*') {
            $annotationsQuery .= " INNER JOIN `annotation_ga_properties` ON `annotation_ga_properties`.`annotation_id` = `annotations`.`id`";
        }
        $annotationsQuery .= " WHERE (";
        if ($userId !== '*' && in_array($userId, $userIdsArray)) {
            $annotationsQuery .= " `annotations`.`user_id` = " . $userId;
        } else {
            $annotationsQuery .= " `annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') ";
        }
        $annotationsQuery .= " AND `annotations`.`is_enabled` = 1 ";
        $annotationsQuery .= " )";

        if ($googleAnalyticsPropertyId && $googleAnalyticsPropertyId !== '*') {
            $gaPropertyId = $googleAnalyticsPropertyId;
            $annotationsQuery .= " AND (`annotation_ga_properties`.`google_analytics_property_id` IS NULL OR `annotation_ga_properties`.`google_analytics_property_id` = " . $gaPropertyId . ")";

            // Can't mark a property as in use without price plan restriction because of the rule:
            // A property that is already in use should not be validated with price plan limits/counts
            // If we mark properties as in use and don't make sure that the user is under limit, it
            // will make a loop hole in the implementation of price plan limits.

            // $googleAnalyticsProperty = GoogleAnalyticsProperty::find($gaPropertyId);
            // if (!$googleAnalyticsProperty->is_in_use) {
            //     if ($user->isPricePlanGoogleAnalyticsPropertyLimitReached()) {
            //         abort(402, 'You\'ve reached the maximum properties for this plan. <a href="' . route('settings.price-plans') . '">Upgrade your plan.</a>');
            //     }
            // }
            // $googleAnalyticsProperty->is_in_use = true;
            // $googleAnalyticsProperty->save();
        }

        if ($user->is_ds_web_monitors_enabled && $showWebMonitoring == 'false') {
            $annotationsQuery .= " AND annotations.category <> 'Website Monitoring'";
        }

        $addedByArray = ['zapier'];
        if ($showManualAnnotations && $showManualAnnotations == 'true') {
            array_push($addedByArray, 'manual');
        }

        if ($showCSVAnnotations && $showCSVAnnotations == 'true') {
            array_push($addedByArray, 'csv-upload');
        }

        if ($showAPIAnnotations && $showAPIAnnotations == 'true') {
            array_push($addedByArray, 'api');
        }

        $annotationsQuery .= " AND added_by IN ('" . implode("', '", $addedByArray) . "')";

        return $annotationsQuery;
    }

    public static function googleAlgorithmQuery($user)
    {
        $annotationsQuery = "";
        $annotationsQuery .= "select update_date AS show_at, google_algorithm_updates.id, category, event_name, NULL as url, description from `google_algorithm_updates`";
        $gAUConf = UserDataSource::where('user_id', $user->id)->where('ds_code', 'google_algorithm_update_dates')->first();
        if ($gAUConf) {
            if ($gAUConf->status != '' && $gAUConf->status != null) {
                $annotationsQuery .= ' where status = "' . $gAUConf->status . '"';
            }
        }

        return $annotationsQuery;
    }

    public static function webMonitorQuery($userIdsArray)
    {
        return "select show_at, id, category, event_name, url, description from `web_monitor_annotations` WHERE `web_monitor_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function holidaysQuery($user, $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays')";
    }

    public static function retailMarketingQuery($user, $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select show_at, retail_marketings.id, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings')";
    }

    public static function openWeatherMapQuery($user, $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select alert_date, open_weather_map_alerts.id, open_weather_map_cities.name, description, null, description from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities')";
    }

    public static function googleAlertsQuery($user, $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select alert_date, google_alerts.id, 'News Alert', title, google_alerts.url, description from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'google_alert_keywords' AND DATE(google_alerts.created_at) > DATE(DATE_ADD(uds.created_at, INTERVAL 1 DAY)) )";
    }

    public static function wordPressQuery()
    {
        $annotationsQuery = "";
        $annotationsQuery .= "select update_date, wordpress_updates.id, category, event_name, url, description from `wordpress_updates`";
        if (UserDataSource::ofCurrentUser()->where('ds_code', 'wordpress_updates')->where('value', 'last year')->count()) {
            $annotationsQuery .= " where (update_date BETWEEN " . Carbon::now()->subYear()->format('Y-m-d') . " AND " . Carbon::now()->format('Y-m-d') . " )";
        }

        return $annotationsQuery;
    }

    public static function googleAdsQuery($userIdsArray)
    {
        return "select null, 1, updated_at, created_at, null, category, event_name, url, description, 'System' AS user_name from `google_ads_annotations` WHERE `google_ads_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function applePodcastQuery($userIdsArray)
    {
        return "select id, category, event, podcast_date, url, description, 'System' AS user_name from `apple_podcast_annotations` WHERE `apple_podcast_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }
}
