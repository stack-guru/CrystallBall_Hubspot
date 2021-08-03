<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class OpenWeatherMapAlert extends Notification
{
    use Queueable;

    public $openWeatherMapAlert;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\OpenWeatherMapAlert $openWeatherMapAlert)
    {
        $this->openWeatherMapAlert = $openWeatherMapAlert;
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

        $notificationSetting = $notifiable->notificationSettingFor("weather_alerts");

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
            ->subject("Weather Alert in: " . $this->openWeatherMapAlert->openWeatherMapCity->name)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('We detected a new Weather Alert: ' . $this->openWeatherMapAlert->event . ' in ' . $this->openWeatherMapAlert->openWeatherMapCity->name . ' at ' . $this->openWeatherMapAlert->alert_date . '.');
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->title("We detected a new Weather Alert: " . $this->openWeatherMapAlert->event . " in " . $this->openWeatherMapAlert->openWeatherMapCity->name . " at " . $this->openWeatherMapAlert->alert_date . ".")
            ->body("");
    }

}
