<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class HolidayTomorrow extends Notification
{
    use Queueable;

    public $holiday;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\Holiday $holiday)
    {
        $this->holiday = $holiday;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $channels = [];

        $notificationSetting = $notifiable->notificationSettingFor("retail_marketing_dates");

        if (!$notificationSetting) {
            return [];
        }

        if (!$notificationSetting->is_enabled) {
            return [];
        }

        if ($notificationSetting->email_one_days_before) {
            array_push($channels, "mail");
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Holiday (in 1 day): " . $this->holiday->event_name)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('Tomorrow is ' . $this->holiday->event_name . '.')
            ->line('Get the most of it by doing the proper adaptations on your site or sending an email.')
            ->line('Check out our email templates <a href="https://www.gaannotations.com/email-templates-retail-marketing-dates">HERE</a>, feel free to use them ;)');
    }

}
