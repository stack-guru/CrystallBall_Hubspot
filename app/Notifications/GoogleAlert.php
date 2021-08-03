<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class GoogleAlert extends Notification
{
    use Queueable;

    public $googleAlert;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\GoogleAlert $googleAlert)
    {
        $this->googleAlert = $googleAlert;
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

        $notificationSetting = $notifiable->notificationSettingFor("news_alerts");

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
            ->subject("News Alerts: " . $this->googleAlert->tag_name . ".")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('We detected a new web page with your keyword: ' . $this->googleAlert->tag_name . '.')
            ->line('The title is: ' . $this->googleAlert->title)
            ->line('We added an annotation for you, here is the ' . $this->googleAlert->url . '.');
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->link($this->googleAlert->url)
            ->title("We detected a new web page with your keyword: " . $this->googleAlert->tag_name . ".")
            ->body("");
    }

}
