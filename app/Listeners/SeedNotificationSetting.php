<?php

namespace App\Listeners;

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
            ['is_enabled' => true, 'name' => 'web_monitors', 'label' => 'Website Monitoring', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => true, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'google_alerts', 'label' => 'News Alerts', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'google_algorithm_updates', 'label' => 'Google Updates', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'retail_marketing_dates', 'label' => 'Retail Marketing Dates', 'user_id' => $user->id, 'email_seven_days_before' => true, 'email_one_days_before' => true, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'holidays', 'label' => 'Holidays', 'user_id' => $user->id, 'email_seven_days_before' => true, 'email_one_days_before' => true, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'weather_alerts', 'label' => 'Weather Alerts', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'wordpress_updates', 'label' => 'Wordpress Updates', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
            ['is_enabled' => true, 'name' => 'api', 'label' => 'Annotation from API', 'user_id' => $user->id, 'email_seven_days_before' => -1, 'email_one_days_before' => -1, 'sms_on_event_day' => -1, 'browser_notification_on_event_day' => true, 'email_on_event_day' => true],
        ]);
    }
}
