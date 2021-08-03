<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;
use Carbon\Carbon;

class WebMonitorUp extends Notification
{
    use Queueable;

    public $webMonitor;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\WebMonitor $webMonitor)
    {
        $this->webMonitor = $webMonitor;
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

        $notificationSetting = $notifiable->notificationSettingFor("web_monitors");

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
            ->subject("Website Monitoring: " . $this->webMonitor->name . "  is back UP")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('The monitor ' . $this->webMonitor->name . ' (' . $this->webMonitor->url . ')  is back UP (It was down for [TIME]).')
            ->line('Event timestamp: ' . Carbon::now());
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->title("The monitor " . $this->webMonitor->name . " (' . $this->webMonitor->url . ')  is back UP (It was down for [TIME]).")
            ->body("Event timestamp: " . Carbon::now());
    }
}
