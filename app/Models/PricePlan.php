<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricePlan extends Model
{
    use HasFactory;


    // There are multiple price plans with same name in the system.
    // Don't confuse yourself with their names, focus on id only.
    const TRIAL = 'Trial';
    const TRIAL_ENDED = 'Trial Ended';
    const FREE = 'Free';
    const INDIVIDUAL = 'Individual';
    const BASIC = 'Basic';
    const PRO = 'Pro';
    const ENTERPRISE = 'Enterprise';

    const APPSUMO_TIER_1 = 'AppSumo Tier 1';
    const APPSUMO_TIER_2 = 'AppSumo Tier 2';

    protected $fillable = [
        'name', 'annotations_count', 'price', 'has_manual_add',
        'has_csv_upload', 'has_api', 'is_enabled', 'has_integrations', "has_data_sources",
        'ga_account_count', 'user_per_ga_account_count', 'short_description',
        'web_monitor_count', 'owm_city_count', 'google_alert_keyword_count',
        'has_notifications', 'has_chrome_extension', 'has_google_data_studio',
        'has_microsoft_power_bi', 'google_analytics_property_count',
        'yearly_discount_percent'
    ];

    protected $hidden = [
        'is_enabled', 'created_at', 'updated_at',
    ];

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }

    protected $casts = [
        'has_manual_add' => 'boolean',
        'has_csv_upload' => 'boolean',
        'has_api' => 'boolean',
        'has_integrations' => 'boolean',
        'has_data_sources' => 'boolean',
        'has_notifications' => 'boolean',
        'has_chrome_extension' => 'boolean',
        'has_google_data_studio' => 'boolean',
        'has_microsoft_power_bi' => 'boolean',

        'is_available' => 'boolean',
    ];
}
