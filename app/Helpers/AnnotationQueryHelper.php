<?php

namespace App\Helpers;

use App\Models\UserDataSource;
use Illuminate\Support\Carbon;
use App\Models\User;

class AnnotationQueryHelper
{
    public static function allAnnotationsUnionQueryString(
        User $user,
        string $annotationGAPropertyId = '*',
        array $userIdsArray = [],
        string $userId = '*',
        bool $showDisabled = false,
        string $showManualAnnotations = 'true',
        string $showCSVAnnotations = 'true',
        string $showAPIAnnotations = 'true',
        string $showWebMonitorings = 'true',
        string $showHolidays = 'true',
        string $showRetailMarketingDates = 'true',
        string $showWeatherAlerts = 'true',
        string $showGoogleAlerts = 'true',
        string $showGoogleAlgorithmUpdates = 'true',
        string $showWordPressUpdates = 'true',
        string $showKeywordTrackings = 'true',
        string $showFacebookTrackings = 'true',
        string $showInstagramTrackings = 'true',
        string $showTwitterTrackings = 'true',
        string $showGoogleAdsHistory = 'true',
        string $showBitBucketTrackings = 'true',
        string $showGitHubTrackings = 'true',
        string $showApplePodcasts = 'true',
        string $showShopify = 'true'
    ) {
        $annotationsQuery = "";
        // SELECT annotations from annotations table
        $annotationsQuery .= self::userAnnotationsQuery($user, $userIdsArray, $showDisabled, $annotationGAPropertyId, $userId, $showWebMonitorings, $showManualAnnotations, $showCSVAnnotations, $showAPIAnnotations);
        // Add web monitor annotations if it is enabled in user data source
        if ($user->is_ds_web_monitors_enabled && $showWebMonitorings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::webMonitorQuery($userIdsArray);
        }
        // Add holidays annotations if it is enabled in user data source
        if ($user->is_ds_holidays_enabled && $showHolidays == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::holidaysQuery($userIdsArray, $annotationGAPropertyId);
        }
        // Add retail marketing date annotations if it is enabled in user data source
        if ($user->is_ds_retail_marketing_enabled && $showRetailMarketingDates == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::retailMarketingQuery($userIdsArray, $annotationGAPropertyId);
        }
        // Add weather update annotations if it is enabled in user data source
        if ($user->is_ds_weather_alerts_enabled && $showWeatherAlerts == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::openWeatherMapQuery($userIdsArray, $annotationGAPropertyId);
        }
        // Add google alert annotations if it is enabled in user data source
        if ($user->is_ds_google_alerts_enabled && $showGoogleAlerts == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::googleAlertsQuery($userIdsArray, $annotationGAPropertyId);
        }
        // Add wordpress update annotations if it is enabled in user data source
        if ($user->is_ds_wordpress_updates_enabled && $showWordPressUpdates == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::wordPressQuery($userIdsArray);
        }
        // Add Google Algorithm Updates annotations if it is enabled in user data source
        if ($user->is_ds_google_algorithm_updates_enabled && $showGoogleAlgorithmUpdates == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::googleAlgorithmQuery($userIdsArray);
        }
        // Add keyword tracking annotations if it is enabled in user data source
        if ($user->is_ds_keyword_tracking_enabled && $showKeywordTrackings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::keywordTrackingQuery($userIdsArray);
        }
        // Add facebook tracking annotations if it is enabled in user data source
        if ($user->is_ds_facebook_tracking_enabled && $showFacebookTrackings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::facebookTrackingQuery($userIdsArray);
        }
        // Add instagram tracking annotations if it is enabled in user data source
        if ($user->is_ds_instagram_tracking_enabled && $showInstagramTrackings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::instagramTrackingQuery($userIdsArray);
        }
        // Add twitter tracking annotations if it is enabled in user data source
        if ($user->is_ds_twitter_tracking_enabled && $showTwitterTrackings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::twitterTrackingQuery($userIdsArray);
        }
        // Add google ads annotations if it is enabled in user data source
        if ($user->is_ds_g_ads_history_change_enabled && $showGoogleAdsHistory == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::googleAdsQuery($userIdsArray);
        }
        // Add bitbucket commit tracking annotations if it is enabled in user data source
        if ($user->is_ds_bitbucket_tracking_enabled && $showBitBucketTrackings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::bitbucketCommitQuery($userIdsArray);
        }
        // Add github commit tracking annotations if it is enabled in user data source
        if ($user->is_ds_github_tracking_enabled && $showGitHubTrackings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::gitHubCommitQuery($userIdsArray);
        }
        // Add apple podcast annotations if it is enabled in user data source
        if ($user->is_ds_apple_podcast_annotation_enabled && $showApplePodcasts == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::applePodcastQuery($userIdsArray);
        }
        // Add apple podcast annotations if it is enabled in user data source
        if ($user->is_ds_shopify_annotation_enabled && $showShopify == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::shopifyQuery($userIdsArray);
        }
        return $annotationsQuery;
    }

    public static function googleAnalyticsPropertyWhereClause(string $googleAnalyticsPropertyId = null)
    {
        $gAPropertyCriteria = "`uds`.`ga_property_id` IS NULL";
        if ($googleAnalyticsPropertyId && $googleAnalyticsPropertyId !== '*') {
            $gAPropertyCriteria = "(`uds`.`ga_property_id` = $googleAnalyticsPropertyId OR $gAPropertyCriteria)";
        }

        return $gAPropertyCriteria;
    }

    public static function userAnnotationsQuery(User $user, array $userIdsArray, $showDisabled = false, string $googleAnalyticsPropertyId = null, string $userId = '*', string $showWebMonitoring = 'false', string $showManualAnnotations = 'false', string  $showCSVAnnotations = 'false', string $showAPIAnnotations = 'false')
    {
        $annotationsQuery = "";
        $annotationsQuery .= "SELECT DISTINCT `annotations`.`is_enabled`, DATE(`show_at`) AS show_at, `annotations`.`id`, `category`, `event_name`, `url`, CONCAT('annotations', '~~~~', `annotations`.`id`,  '~~~~', CASE WHEN IFNULL(`annotations`.`added_by_name`, '') > '' THEN `annotations`.`added_by_name` ELSE `users`.`name` END, '~~~~', `annotations`.`added_by`) AS `added_by`, `description`, `users`.`name` AS `user_name`, `annotations`.`created_at`, CONCAT((SELECT GROUP_CONCAT(`annotation_ga_properties`.`google_analytics_property_id`) FROM `annotation_ga_properties` WHERE `annotation_ga_properties`.`annotation_id` = `annotations`.`id` GROUP BY `annotation_ga_properties`.`annotation_id`), '~~~~', (SELECT GROUP_CONCAT(`google_analytics_properties`.`name`) FROM `annotation_ga_properties` LEFT JOIN `google_analytics_properties` ON `annotation_ga_properties`.`google_analytics_property_id` = `google_analytics_properties`.`id` WHERE `annotation_ga_properties`.`annotation_id` = `annotations`.`id` GROUP BY `annotation_ga_properties`.`annotation_id`)) AS `table_ga_property_id` FROM `annotations`";
        $annotationsQuery .= " LEFT JOIN `users` ON `annotations`.`user_id` = `users`.`id`";
        $annotationsQuery .= " LEFT JOIN `annotation_ga_properties` ON `annotation_ga_properties`.`annotation_id` = `annotations`.`id`";
        $annotationsQuery .= " LEFT JOIN `google_analytics_properties` ON `annotation_ga_properties`.`google_analytics_property_id` = `google_analytics_properties`.`id`"; // Add this line

        $annotationsQuery .= " WHERE (";
        if ($userId !== '*' && in_array($userId, $userIdsArray)) {
            $annotationsQuery .= " `annotations`.`user_id` = " . $userId;
        } else {
            $annotationsQuery .= " `annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') ";
        }
        if (!$showDisabled) $annotationsQuery .= " AND `annotations`.`is_enabled` = 1 ";
        $annotationsQuery .= " )";

        if (($googleAnalyticsPropertyId && $googleAnalyticsPropertyId !== '*')) {
            $gaPropertyId = $googleAnalyticsPropertyId;
            $annotationsQuery .= " AND (LOCATE('" . $gaPropertyId . "', CONCAT(`annotation_ga_properties`.`google_analytics_property_id`, '~~~~', `google_analytics_properties`.`name`)) > 0 OR CONCAT(`annotation_ga_properties`.`google_analytics_property_id`, '~~~~', `google_analytics_properties`.`name`) IS NULL)";
        } else if($googleAnalyticsPropertyId && $googleAnalyticsPropertyId == '*' && $user->assigned_properties_id) {
            $gaPropertyId = $user->assigned_properties_id;
            $annotationsQuery .= " AND (LOCATE('" . $gaPropertyId . "', CONCAT((SELECT GROUP_CONCAT(`annotation_ga_properties`.`google_analytics_property_id`) FROM `annotation_ga_properties` WHERE `annotation_ga_properties`.`annotation_id` = `annotations`.`id` GROUP BY `annotation_ga_properties`.`annotation_id`), '~~~~', (SELECT GROUP_CONCAT(`google_analytics_properties`.`name`) FROM `annotation_ga_properties` LEFT JOIN `google_analytics_properties` ON `annotation_ga_properties`.`google_analytics_property_id` = `google_analytics_properties`.`id` WHERE `annotation_ga_properties`.`annotation_id` = `annotations`.`id` GROUP BY `annotation_ga_properties`.`annotation_id`))) > 0 OR CONCAT((SELECT GROUP_CONCAT(`annotation_ga_properties`.`google_analytics_property_id`) FROM `annotation_ga_properties` WHERE `annotation_ga_properties`.`annotation_id` = `annotations`.`id` GROUP BY `annotation_ga_properties`.`annotation_id`), '~~~~', (SELECT GROUP_CONCAT(`google_analytics_properties`.`name`) FROM `annotation_ga_properties` LEFT JOIN `google_analytics_properties` ON `annotation_ga_properties`.`google_analytics_property_id` = `google_analytics_properties`.`id` WHERE `annotation_ga_properties`.`annotation_id` = `annotations`.`id` GROUP BY `annotation_ga_properties`.`annotation_id`)) IS NULL)";
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

    public static function googleAlgorithmQuery(array $userIdsArray)
    {
        $annotationsQuery = "";
        $annotationsQuery .= "select 1, update_date AS show_at, NULL, category, event_name, NULL as url, 
        CONCAT('google_algorithm_updates', '~~~~', `google_algorithm_updates`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, 'System' AS `user_name`, update_date, `uds`.`ga_property_id` AS `table_ga_property_id` 
        from `google_algorithm_updates` 
        LEFT JOIN `user_data_sources` AS uds ON `uds`.`ds_code` = 'google_algorithm_update_dates' 
        AND `uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') ";

        // $gAUConf = UserDataSource::whereIn('user_id', $userIdsArray)->where('ds_code', 'google_algorithm_update_dates')->first();
        // if ($gAUConf) {
        //     if ($gAUConf->status != '' && $gAUConf->status != null) {
        //         $annotationsQuery .= ' where google_algorithm_updates.status = "' . $gAUConf->status . '"';
        //     }
        // }

        return $annotationsQuery;
    }

    public static function webMonitorQuery(array $userIdsArray)
    {
        return "select 1, show_at, NULL, category, event_name, web_monitor_annotations.url, CONCAT('web_monitor_annotations', '~~~~', `web_monitor_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, show_at, `ga_property_id` AS `table_ga_property_id` from `web_monitor_annotations` LEFT JOIN `web_monitors` ON `web_monitors`.`id` = `web_monitor_annotations`.`web_monitor_id` LEFT JOIN `users` ON `web_monitor_annotations`.`user_id` = `users`.`id` WHERE `web_monitor_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function shopifyQuery(array $userIdsArray)
    {
        return "select 1, published_at AS show_at, NULL, category, title AS event_name, NULL AS url, CONCAT('shopify_annotations', '~~~~', `shopify_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, body_html AS description, `users`.`name` AS `user_name`, NULL AS show_at, `shopify_monitors`.`ga_property_id` AS `table_ga_property_id`
        from `shopify_annotations`
        LEFT JOIN `shopify_monitors` ON `shopify_monitors`.`url` LIKE CONCAT('%', REPLACE(`shopify_annotations`.`vendor`, ' ', ''), '%')
        LEFT JOIN `users` ON `shopify_annotations`.`user_id` = `users`.`id`
        WHERE `shopify_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
//        AND JSON_CONTAINS(`shopify_monitors`.`events`, JSON_QUOTE(`shopify_annotations`.`category`))";
    }

    public static function holidaysQuery(array $userIdsArray, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select 1, holiday_date AS show_at, NULL, category, event_name, NULL as url, CONCAT('holidays', '~~~~', `uds`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, 'System' AS `user_name`, holiday_date, `uds`.`ga_property_id` AS `table_ga_property_id` from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where $gAPropertyCriteria AND (`uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') and `uds`.`ds_code` = 'holidays')";
    }

    public static function retailMarketingQuery(array $userIdsArray, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select 1, show_at, NULL, category, event_name, NULL as url, CONCAT('retail_marketings', '~~~~', `uds`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, 'System' AS `user_name`, show_at, `uds`.`ga_property_id` AS `table_ga_property_id` from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where $gAPropertyCriteria AND (`uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') and `uds`.`ds_code` = 'retail_marketings')";
    }

    public static function openWeatherMapQuery(array $userIdsArray, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select 1, alert_date, NULL, open_weather_map_cities.name, description, null, CONCAT('open_weather_map_alerts', '~~~~', `uds`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, 'System' AS `user_name`, alert_date, `uds`.`ga_property_id` AS `table_ga_property_id` from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where $gAPropertyCriteria AND (`uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') and `uds`.`ds_code` = 'open_weather_map_cities')";
    }

    public static function googleAlertsQuery(array $userIdsArray, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select 1, alert_date, NULL, 'News Alert', title, google_alerts.url, CONCAT('google_alerts', '~~~~', `google_alerts`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, 'System' AS `user_name`, alert_date, `uds`.`ga_property_id` AS `table_ga_property_id` from `google_alerts` inner join `user_data_sources` as `uds` on `uds`.`value` = `google_alerts`.tag_name where $gAPropertyCriteria AND (`uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') AND `uds`.`ds_code` = 'google_alert_keywords' AND DATE(google_alerts.created_at) > DATE(DATE_ADD(uds.created_at, INTERVAL 1 DAY)) )";
    }

    public static function wordPressQuery($userIdsArray)
    {
        $annotationsQuery = "";
        $annotationsQuery .= "select 1, update_date, NULL, category, event_name, wordpress_updates.url, CONCAT('wordpress_updates', '~~~~', `wordpress_updates`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, 'System' AS `user_name`, update_date, `uds`.`ga_property_id` AS `table_ga_property_id` from `wordpress_updates` LEFT JOIN `user_data_sources` AS uds ON `uds`.`ds_code` = 'wordpress_updates' AND `uds`.`value` = 'last year' AND `uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') ";
        if (UserDataSource::ofCurrentUser()->where('ds_code', 'wordpress_updates')->where('value', 'last year')->count()) {
            $annotationsQuery .= " where (update_date BETWEEN " . Carbon::now()->subYear()->format('Y-m-d') . " AND " . Carbon::now()->format('Y-m-d') . " )";
        }

        return $annotationsQuery;
    }

    public static function keywordTrackingQuery(array $userIdsArray)
    {
        return "select 1, keyword_tracking_annotations.created_at, NULL, category, event_name, keyword_tracking_annotations.url, CONCAT('keyword_tracking_annotations', '~~~~', `keyword_tracking_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, keyword_tracking_annotations.created_at, `uds`.`ga_property_id` AS `table_ga_property_id` from `keyword_tracking_annotations` LEFT JOIN `user_data_sources` AS uds ON `uds`.`ds_code` = 'keyword_tracking' AND `keyword_tracking_annotations`.`url` LIKE CONCAT('%', `uds`.`workspace`, '%') AND `uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') LEFT JOIN `users` ON `keyword_tracking_annotations`.`user_id` = `users`.`id` WHERE `keyword_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function facebookTrackingQuery(array $userIdsArray)
    {
        return "select 1, facebook_tracking_annotations.created_at, NULL, category, event_name, facebook_tracking_annotations.url, CONCAT('facebook_tracking_annotations', '~~~~', `facebook_tracking_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, facebook_tracking_annotations.created_at, `ftc`.`ga_property_id` AS `table_ga_property_id` from `facebook_tracking_annotations` LEFT JOIN `facebook_tracking_configurations` AS ftc ON `ftc`.`id` = `facebook_tracking_annotations`.`configuration_id` LEFT JOIN `users` ON `facebook_tracking_annotations`.`user_id` = `users`.`id` WHERE `facebook_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function instagramTrackingQuery(array $userIdsArray)
    {
        return "select 1, instagram_tracking_annotations.created_at, NULL, category, event_name, instagram_tracking_annotations.url, CONCAT('instagram_tracking_annotations', '~~~~', `instagram_tracking_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, instagram_tracking_annotations.created_at, `itc`.`ga_property_id` AS `table_ga_property_id` from `instagram_tracking_annotations` LEFT JOIN `instagram_tracking_configurations` AS itc ON `itc`.`id` = `instagram_tracking_annotations`.`configuration_id` LEFT JOIN `users` ON `instagram_tracking_annotations`.`user_id` = `users`.`id` WHERE `instagram_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function twitterTrackingQuery(array $userIdsArray)
    {
        return "select 1, twitter_tracking_annotations.created_at, NULL, category, event_name, twitter_tracking_annotations.url, CONCAT('twitter_tracking_annotations', '~~~~', `twitter_tracking_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, twitter_tracking_annotations.created_at, `ttc`.`ga_property_id` AS `table_ga_property_id` from `twitter_tracking_annotations` LEFT JOIN `twitter_tracking_configurations` AS ttc ON `ttc`.`id` = `twitter_tracking_annotations`.`configuration_id` LEFT JOIN `users` ON `twitter_tracking_annotations`.`user_id` = `users`.`id` WHERE `twitter_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function bitbucketCommitQuery(array $userIdsArray)
    {
        return "select 1, bitbucket_commit_annotations.created_at, NULL, category, event_name, bitbucket_commit_annotations.url, CONCAT('bitbucket_commit_annotations', '~~~~', `bitbucket_commit_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, bitbucket_commit_annotations.created_at, `uds`.`ga_property_id` AS `table_ga_property_id` from `bitbucket_commit_annotations` LEFT JOIN `user_data_sources` AS uds ON `uds`.`ds_code` = 'bitbucket_tracking' AND `bitbucket_commit_annotations`.`url` LIKE CONCAT('%', `uds`.`workspace`, '%') AND `bitbucket_commit_annotations`.`url` LIKE CONCAT('%', `uds`.`value`, '%') AND `uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') LEFT JOIN `users` ON `bitbucket_commit_annotations`.`user_id` = `users`.`id` WHERE `bitbucket_commit_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function gitHubCommitQuery(array $userIdsArray)
    {
        return "select 1, github_commit_annotations.created_at, NULL, category, event_name, github_commit_annotations.url, CONCAT('github_commit_annotations', '~~~~', `github_commit_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, github_commit_annotations.created_at, `uds`.`ga_property_id` AS `table_ga_property_id` from `github_commit_annotations` LEFT JOIN `user_data_sources` AS uds ON `uds`.`ds_code` = 'github_tracking' AND `github_commit_annotations`.`url` LIKE CONCAT('%', `uds`.`workspace`, '%') AND `uds`.`user_id` IN ('" . implode("', '", $userIdsArray) . "') LEFT JOIN `users` ON `github_commit_annotations`.`user_id` = `users`.`id` WHERE `github_commit_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function googleAdsQuery(array $userIdsArray)
    {
        return "select 1, google_ads_annotations.created_at, NULL, category, event_name, url, CONCAT('google_ads_annotations', '~~~~', `google_ads_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, google_ads_annotations.created_at, NULL AS `table_ga_property_id` from `google_ads_annotations` LEFT JOIN `users` ON `google_ads_annotations`.`user_id` = `users`.`id` WHERE `google_ads_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function applePodcastQuery(array $userIdsArray)
    {
        return "select 1, podcast_date, NULL, category, event, apple_podcast_annotations.url, CONCAT('apple_podcast_annotations', '~~~~', `apple_podcast_annotations`.`id`,  '~~~~', 'System', '~~~~', 'System') AS `added_by`, description, `users`.`name` AS `user_name`, podcast_date, `apple_podcast_monitors`.`ga_property_id` AS `table_ga_property_id` from `apple_podcast_annotations` LEFT JOIN `apple_podcast_monitors` ON `apple_podcast_annotations`.`url` = `apple_podcast_monitors`.`url` LEFT JOIN `users` ON `apple_podcast_annotations`.`user_id` = `users`.`id` WHERE `apple_podcast_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }
}
