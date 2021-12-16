<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PricePlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('price_plans')->insert(
            [
                [
                    'name' => 'Free',
                    'annotations_count' => '100',
                    'price' => '0',
                    'has_manual_add' => '1',
                    'has_csv_upload' => '1',
                    'has_api' => '1',
                    'is_enabled' => '1',
                    'has_integrations' => '1',
                    'has_data_sources' => '1',
                    'ga_account_count' => '1',
                    'user_per_ga_account_count' => '1',
                    'short_description' => 'For Small Businesses',
                    'is_available' => '1',
                    'web_monitor_count' => '1',
                    'owm_city_count' => '50',
                    'google_alert_keyword_count' => '10',
                    'has_notifications' => '1',
                    'has_chrome_extension' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                ],
                [
                    'name' => 'Basic',
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
                    'has_chrome_extension' => '1',
                    'has_google_data_studio' => '0',
                    'has_microsoft_power_bi' => '0',
                ],
                [
                    'name' => 'Pro',
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
                    'web_monitor_count' => '3',
                    'owm_city_count' => '-1',
                    'google_alert_keyword_count' => '100',
                    'has_notifications' => '1',
                    'has_chrome_extension' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                ],
                [
                    'name' => 'Trial',
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
                    'has_chrome_extension' => '1',
                    'has_google_data_studio' => '1',
                    'has_microsoft_power_bi' => '1',
                ],
            ]
        );
    }
}
