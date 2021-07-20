<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\NotificationSetting;

class SeedNotificationSetting
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $user = $event->user;

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
}
