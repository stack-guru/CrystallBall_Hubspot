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
        string $showApplePodcasts = 'true'
    ) {
        $annotationsQuery = "";
        // SELECT annotations from annotations table
        $annotationsQuery .= self::userAnnotationsQuery($user, $userIdsArray, $annotationGAPropertyId, $userId, $showWebMonitorings, $showManualAnnotations, $showCSVAnnotations, $showAPIAnnotations);
        // Add web monitor annotations if it is enabled in user data source
        if ($user->is_ds_web_monitors_enabled && $showWebMonitorings == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::webMonitorQuery($userIdsArray);
        }
        // Add holidays annotations if it is enabled in user data source
        if ($user->is_ds_holidays_enabled && $showHolidays == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::holidaysQuery($user, $annotationGAPropertyId);
        }
        // Add retail marketing date annotations if it is enabled in user data source
        if ($user->is_ds_retail_marketing_enabled && $showRetailMarketingDates == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::retailMarketingQuery($user, $annotationGAPropertyId);
        }
        // Add weather update annotations if it is enabled in user data source
        if ($user->is_ds_weather_alerts_enabled && $showWeatherAlerts == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::openWeatherMapQuery($user, $annotationGAPropertyId);
        }
        // Add google alert annotations if it is enabled in user data source
        if ($user->is_ds_google_alerts_enabled && $showGoogleAlerts == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::googleAlertsQuery($user, $annotationGAPropertyId);
        }
        // Add wordpress update annotations if it is enabled in user data source
        if ($user->is_ds_wordpress_updates_enabled && $showWordPressUpdates == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::wordPressQuery();
        }
        // Add Google Algorithm Updates annotations if it is enabled in user data source
        if ($user->is_ds_google_algorithm_updates_enabled && $showGoogleAlgorithmUpdates == 'true') {
            $annotationsQuery .= " union ";
            $annotationsQuery .= self::googleAlgorithmQuery($user);
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

    public static function userAnnotationsQuery(User $user, array $userIdsArray, string $googleAnalyticsPropertyId = null, string $userId = '*', string $showWebMonitoring = 'false', string $showManualAnnotations = 'false', string  $showCSVAnnotations = 'false', string $showAPIAnnotations = 'false')
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

    public static function googleAlgorithmQuery(User $user)
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

    public static function webMonitorQuery(array $userIdsArray)
    {
        return "select show_at, id, category, event_name, url, description from `web_monitor_annotations` WHERE `web_monitor_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function holidaysQuery(User $user, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select holiday_date AS show_at, holidays.id, category, event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays')";
    }

    public static function retailMarketingQuery(User $user, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select show_at, retail_marketings.id, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings')";
    }

    public static function openWeatherMapQuery(User $user, string $googleAnalyticsPropertyId)
    {
        $gAPropertyCriteria = self::googleAnalyticsPropertyWhereClause($googleAnalyticsPropertyId);
        return "select alert_date, open_weather_map_alerts.id, open_weather_map_cities.name, description, null, description from `open_weather_map_alerts` inner join `user_data_sources` as `uds` on `uds`.`open_weather_map_city_id` = `open_weather_map_alerts`.open_weather_map_city_id inner join `user_data_sources` as `owmes` on `owmes`.`open_weather_map_event` = `open_weather_map_alerts`.`event` inner join `open_weather_map_cities` on `open_weather_map_cities`.id = `open_weather_map_alerts`.`open_weather_map_city_id` where $gAPropertyCriteria AND (`uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'open_weather_map_cities')";
    }

    public static function googleAlertsQuery(User $user, string $googleAnalyticsPropertyId)
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

    public static function keywordTrackingQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `keyword_tracking_annotations` WHERE `keyword_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function facebookTrackingQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `facebook_tracking_annotations` WHERE `facebook_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function instagramTrackingQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `instagram_tracking_annotations` WHERE `instagram_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function twitterTrackingQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `twitter_tracking_annotations` WHERE `twitter_tracking_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function bitbucketCommitQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `bitbucket_commit_annotations` WHERE `bitbucket_commit_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function gitHubCommitQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `github_commit_annotations` WHERE `github_commit_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function googleAdsQuery(array $userIdsArray)
    {
        return "select created_at, null, category, event_name, url, description from `google_ads_annotations` WHERE `google_ads_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }

    public static function applePodcastQuery(array $userIdsArray)
    {
        return "select podcast_date, null, category, event, url, description from `apple_podcast_annotations` WHERE `apple_podcast_annotations`.`user_id` IN ('" . implode("', '", $userIdsArray) . "')";
    }
}
