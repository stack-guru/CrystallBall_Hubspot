<?php

namespace App\Helpers;

use App\Models\GoogleAnalyticsProperty;
use App\Models\NotificationSetting;
use App\Models\PricePlan;
use App\Models\User;
use App\Models\WebMonitor;
use App\Services\SendGridService;

class DowngradedUserHelper
{

    public static function downgradingUser($user,$pricePlan)
    {
        $sGS = new SendGridService;
        if ($user->pricePlan->name == PricePlan::PRO && $pricePlan->name == PricePlan::BASIC) {
            // User is downgrading to basic plan from pro plan
            $sGS->addUserToMarketingList($user, "11 GAa Downgraded to Basic");
        }
        if($pricePlan->web_monitor_count != 0)
            WebMonitor::removeAdditionalWebMonitors($user, $pricePlan->web_monitor_count);
        if($pricePlan->google_analytics_property_count != 0)
            self::removeExtraAnnotationGaProperty($user, $pricePlan->web_monitor_count);
        self::disableDataSources($user,$pricePlan);
        if($pricePlan->user_per_ga_account_count == 0) 
            self::removeExtraUser($user,$pricePlan);
        if(!$pricePlan->has_notifications)
            NotificationSetting::disableNotifications($user);
    }
    public static function disableDataSources($user,$pricePlan)
    {
        $user->is_ds_holidays_enabled = false;
        $user->is_ds_wordpress_updates_enabled = false;
        $user->is_ds_google_algorithm_updates_enabled = false;
        $user->is_ds_retail_marketing_enabled = false;
        if($pricePlan->aws_credits_count == -1 || $pricePlan->aws_credits_count == null)
        {
            //
        }
        if($pricePlan->linkedin_credits_count == -1 || $pricePlan->linkedin_credits_count == null)
        {
            //
        }
        if($pricePlan->twitter_credits_count == -1 || $pricePlan->twitter_credits_count == null)
        {
            $user->is_ds_twitter_tracking_enabled = false;
        }
        if($pricePlan->keyword_tracking_count == -1 || $pricePlan->keyword_tracking_count == null)
            $user->is_ds_keyword_tracking_enabled = false;
        if($pricePlan->github_credits_count == -1 || $pricePlan->github_credits_count == null)
            $user->is_ds_github_tracking_enabled = false;
        if($pricePlan->bitbucket_credits_count == -1 || $pricePlan->bitbucket_credits_count == null)
            $user->is_ds_bitbucket_tracking_enabled = false;
        if($pricePlan->google_alert_keyword_count == -1 || $pricePlan->google_alert_keyword_count == null)
            $user->is_ds_google_alerts_enabled = false;
        if($pricePlan->owm_city_count == -1 || $pricePlan->owm_city_count == null)
            $user->is_ds_weather_alerts_enabled = false;
        if($pricePlan->web_monitor_count == -1 || $pricePlan->web_monitor_count == null)
            $user->is_ds_web_monitors_enabled = false;
        if($pricePlan->shopify_monitor_count == -1 || $pricePlan->shopify_monitor_count == null)
            $user->is_ds_shopify_annotation_enabled = false;
        if($pricePlan->apple_podcast_monitor_count == -1 || $pricePlan->apple_podcast_monitor_count == null)
            $user->is_ds_apple_podcast_annotation_enabled = false;
        $user->save();

    }
    public static function checkAppsInUse($user,$pricePlan)
    {
        $names = [];
        if($user->is_ds_holidays_enabled)
            $names[] = "Holiday";
        if($user->is_ds_wordpress_updates_enabled)
            $names[] = "Wordpress";
        if($user->is_ds_google_algorithm_updates_enabled)
            $names[] = "Google Algorithm";
        if($user->is_ds_retail_marketing_enabled)
            $names[] = "Retail Marketing";
        if($pricePlan->aws_credits_count == -1 || $pricePlan->aws_credits_count == null)
        {
            //
        }
        if($pricePlan->linkedin_credits_count == -1 || $pricePlan->linkedin_credits_count == null)
        {
            //
        }
        if($pricePlan->twitter_credits_count == -1 || $pricePlan->twitter_credits_count == null)
        {
            if($user->is_ds_twitter_tracking_enabled)
                $names[] = "Twitter";
        }
        if($pricePlan->keyword_tracking_count == -1 || $pricePlan->keyword_tracking_count == null)
        {
            if($user->is_ds_keyword_tracking_enabled)
                $names[] = "Rank Tracking";
        }
        if($pricePlan->github_credits_count == -1 || $pricePlan->github_credits_count == null)
        {
            if($user->is_ds_github_tracking_enabled)
                $names[] = "GitHub";
        }
        if($pricePlan->bitbucket_credits_count == -1 || $pricePlan->bitbucket_credits_count == null)
        {
            if($user->is_ds_bitbucket_tracking_enabled)
                $names[] = "Bitbucket";
        }
        if($pricePlan->google_alert_keyword_count == -1 || $pricePlan->google_alert_keyword_count == null)
        {
            if($user->is_ds_google_alerts_enabled)
                $names[] = "Google Alert";
        }
        if($pricePlan->owm_city_count == -1 || $pricePlan->owm_city_count == null)
        {
            if($user->is_ds_weather_alerts_enabled)
                $names[] = "Weather Alert";
        }
        if($pricePlan->web_monitor_count == -1 || $pricePlan->web_monitor_count == null)
        {
            if($user->is_ds_web_monitors_enabled)
                $names[] = "Website Monitor";
        }
        if($pricePlan->shopify_monitor_count == -1 || $pricePlan->shopify_monitor_count == null)
        {
            if($user->is_ds_shopify_annotation_enabled)
                $names[] = "Shopify";
        }
        if($pricePlan->apple_podcast_monitor_count == -1 || $pricePlan->apple_podcast_monitor_count == null)
        {
            if($user->is_ds_apple_podcast_annotation_enabled)
                $names[] = "Apple";
        }
        return $names;
    }
    public static function removeExtraUser($user,$pricePlan)
    {
        $users = User::where('user_id',$user->id)->get();
        foreach ($users as $index => $new_user) {
            if($pricePlan->user_per_ga_account_count == -1 || $index >= $pricePlan->user_per_ga_account_count)
            {
                $new_user->status = User::STATUS_SUSPENDED;
                $new_user->save();
            }
        }
    }
    public static function checkExtraUser($user,$pricePlan)
    {
        $users = User::where('user_id',$user->id)->get();
        $extra_user = [];
        foreach ($users as $index => $new_user) {
            if($pricePlan->user_per_ga_account_count == -1 || $index >= $pricePlan->user_per_ga_account_count)
            {
                $extra_user[] = $new_user->name;
            }
        }
        return $extra_user;
    }
    public static function removeExtraAnnotationGaProperty($user,$pricePlan)
    {
        $properties = GoogleAnalyticsProperty::where('user_id',$user->id)->get();
        foreach ($properties as $index => $property) {
            if($pricePlan->google_analytics_property_count == -1 || $index >= $pricePlan->google_analytics_property_count)
            {
                $property->is_in_use = false;
                $property->save();
            }
        }
        // $properties = Ga::where('user_id',$user->id)->get();
    }
}
