<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class HolidayEvent extends Notification
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

        $notificationSetting = $notifiable->notificationSettingFor("holidays");

        if (!$notificationSetting) {
            return [];
        }

        if (!$notificationSetting->is_enabled) {
            return [];
        }

        if ($notificationSetting->email_on_event_day) {
            array_push($channels, "mail");
        }

        if ($notificationSetting->browser_notification_on_event_day) {
            array_push($channels, PusherChannel::class);
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
        $mailMessage = (new MailMessage)
            ->subject("Holiday (Today): " . $this->holiday->event_name)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('Today is ' . $this->holiday->event_name . '.')
            ->line('We hope you did the proper adaptations on your site and are ready to release a great email.')
            ->line('Check out our email templates <a href="https://www.crystalballinsight.com/email-templates-holidays">HERE</a>, feel free to use them ;)');

        if ($this->holiday->url) {
            $mailMessage->line('Learn more about this Holiday <a href="' . $this->holiday->url . '">HERE</a>.');
        }

        return $mailMessage;
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->title("Holidays Notification.")
            ->body("Today is " . $this->holiday->event_name . ".");
    }

}
