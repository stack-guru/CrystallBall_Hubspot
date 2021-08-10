<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class RetailMarketingEvent extends Notification
{
    use Queueable;

    public $retailMarketing;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\RetailMarketing $retailMarketing)
    {
        $this->retailMarketing = $retailMarketing;
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
        return (new MailMessage)
            ->subject("Retail Marketing Day (Today): " . $this->retailMarketing->event_name)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('Today is ' . $this->retailMarketing->event_name . '.')
            ->line('We hope you did the proper adaptations on your site and are ready to release a great email.')
            ->line('Check out our email templates HERE, feel free to use them ;)');
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->link($this->retailMarketing->url)
            ->title("Retail Marketing Dates Notification.")
            ->body("Today is " . $this->retailMarketing->event_name . ".");
    }

}
