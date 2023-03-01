<?php

namespace App\Helpers;

use App\Models\AnnotationGaProperty;
use App\Models\GoogleAnalyticsProperty;
use App\Models\NotificationSetting;
use App\Models\PricePlan;
use App\Models\User;
use App\Models\WebMonitor;
use App\Services\SendGridService;

class UpgradedUserHelper
{

    public static function UpgradingUser($user,$pricePlan)
    {
        if($pricePlan->google_analytics_property_count != -1)
            self::addExtraAnnotationGaProperty($user, $pricePlan);
        if($pricePlan->user_per_ga_account_count != -1) 
            self::addExtraUser($user,$pricePlan);
    }
    public static function addExtraUser($user,$pricePlan)
    {
        $users = User::where('user_id',$user->id)->get();
        foreach ($users as $index => $new_user) {
            if($pricePlan->user_per_ga_account_count == 0 || $index >= $pricePlan->user_per_ga_account_count)
            {
                $new_user->status = User::STATUS_ACTIVE;
                $new_user->save();
            }
        }
    }
    public static function addExtraAnnotationGaProperty($user,$pricePlan)
    {
        $properties = GoogleAnalyticsProperty::where('user_id',$user->id)->get();
        foreach ($properties as $index => $property) {
            if($pricePlan->google_analytics_property_count == 0 || $index >= $pricePlan->google_analytics_property_count)
            {
                $property->is_in_use = true;
                $property->save();
            }
        }
    }
}
