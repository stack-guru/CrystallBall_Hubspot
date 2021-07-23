<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\NotificationSetting;

class NotificationSettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::select('users.id')
            ->leftJoin('notification_settings', 'users.id', 'notification_settings.user_id')
            ->whereNull('notification_settings.id')
            ->distinct()
            ->get();

        print count($users) . " users found to be seeded.\n";

        foreach($users as $user){
            NotificationSetting::insert([
                ['is_enabled' => false, 'name' => 'web_monitors', 'label' => 'Website Monitoring', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => 0],
                ['is_enabled' => false, 'name' => 'news_alerts', 'label' => 'News Alerts', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day'=>-1],
                ['is_enabled' => false, 'name' => 'google_algorithm_updates', 'label' => 'Google Updates', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day'=>-1],
                ['is_enabled' => false, 'name' => 'retail_marketing_dates', 'label' => 'Retail Marketing Dates', 'user_id' => $user->id, 'email_seven_days_before' => 0, 'email_one_days_before' => 0, 'sms_on_event_day'=>-1],
                ['is_enabled' => false, 'name' => 'holidays', 'label' => 'Holidays', 'user_id' => $user->id, 'email_seven_days_before' => 0, 'email_one_days_before' => 0, 'sms_on_event_day'=>-1],
                ['is_enabled' => false, 'name' => 'weather_alerts', 'label' => 'Weather Alerts', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day'=>-1],
                ['is_enabled' => false, 'name' => 'wordpress_updates', 'label' => 'Wordpress Updates', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day'=>-1],
                ['is_enabled' => false, 'name' => 'api', 'label' => 'Annotation from API', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day'=>-1],
            ]);
        }
        info("Seeding completed!");
    }
}
