<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\PricePlan;

class PricePlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // There are multiple price plans with same name in the system.
        // Don't confuse yourself with their names, focus on id only.
        DB::table('price_plans')->insert(
            [
                [
                    'name' => PricePlan::FREE,
                    'annotations_count' => '100',
                    'price' => '0',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '0',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'For Small Businesses',
                    'is_available' => '0',
                    'web_monitor_count' => '1',
                    'owm_city_count' => '50',
                    'google_alert_keyword_count' => '10',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '0',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::BASIC,
                    'annotations_count' => '0',
                    'price' => '19',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '0',
                    'has_integrations' => '0',
                    'has_data_sources' => '1',
                    'ga_account_count' => '1',
                    'user_per_ga_account_count' => '1',
                    'short_description' => 'For Medium Businesses',
                    'is_available' => '0',
                    'web_monitor_count' => '1',
                    'owm_city_count' => '50',
                    'google_alert_keyword_count' => '10',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '0',
                    'has_microsoft_power_bi' => '0',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '0',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::PRO,
                    'annotations_count' => '0',
                    'price' => '99',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '0',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'For Big Businesses & Professionals Marketers',
                    'is_available' => '0',
                    'web_monitor_count' => '3',
                    'owm_city_count' => '0',
                    'google_alert_keyword_count' => '100',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '0',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::TRIAL,
                    'annotations_count' => '0',
                    'price' => '0',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '0',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'New Sign up 14 days',
                    'is_available' => '0',
                    'web_monitor_count' => '3',
                    'owm_city_count' => '50',
                    'google_alert_keyword_count' => '10',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '10',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::INDIVIDUAL,
                    'annotations_count' => '0',
                    'price' => '9',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '1',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'For Freelancers',
                    'is_available' => '1',
                    'web_monitor_count' => '1',
                    'owm_city_count' => '5',
                    'google_alert_keyword_count' => '5',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '3',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::BASIC,
                    'annotations_count' => '0',
                    'price' => '49',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '1',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'For Small Businesses',
                    'is_available' => '1',
                    'web_monitor_count' => '10',
                    'owm_city_count' => '20',
                    'google_alert_keyword_count' => '20',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '10',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::PRO,
                    'annotations_count' => '0',
                    'price' => '99',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '1',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'For Big Businesses & Professionals Marketers',
                    'is_available' => '1',
                    'web_monitor_count' => '25',
                    'owm_city_count' => '50',
                    'google_alert_keyword_count' => '50',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '25',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::TRIAL_ENDED,
                    'annotations_count' => '1',
                    'price' => '0',
                    'has_manual_add' => '0',
                    'has_csv_upload' => '0',
                    'has_api' => '0',
                    'is_enabled' => '0',
                    'has_integrations' => '0',
                    'has_data_sources' => '0',
                    'ga_account_count' => '1',
                    'user_per_ga_account_count' => '1',
                    'short_description' => '.',
                    'is_available' => '0',
                    'web_monitor_count' => '1',
                    'owm_city_count' => '-1',
                    'google_alert_keyword_count' => '-1',
                    'has_notifications' => '0',
                    'has_google_data_studio' => '0',
                    'has_microsoft_power_bi' => '0',
                    'has_chrome_extension' => '0',
                    'google_analytics_property_count' => '-1',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::APPSUMO_TIER_1,
                    'annotations_count' => '0',
                    'price' => '59',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '0',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'AppSumo Tier 1',
                    'is_available' => '1',
                    'web_monitor_count' => '3',
                    'owm_city_count' => '20',
                    'google_alert_keyword_count' => '100',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '0',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '10',
                    'yearly_discount_percent' => 30
                ],
                [
                    'name' => PricePlan::APPSUMO_TIER_2,
                    'annotations_count' => '0',
                    'price' => '119',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '0',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '0',
                    'user_per_ga_account_count' => '0',
                    'short_description' => 'AppSumo Tier 2',
                    'is_available' => '1',
                    'web_monitor_count' => '3',
                    'owm_city_count' => '20',
                    'google_alert_keyword_count' => '100',
                    'has_notifications' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '0',
                    'has_chrome_extension' => '1',
                    'google_analytics_property_count' => '0',
                    'yearly_discount_percent' => 30
                ]
            ]
        );
    }
}
