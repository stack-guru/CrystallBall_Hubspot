<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class WebMonitorDown extends Notification
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

        if ($notificationSetting->sms_on_event_day) {
            array_push($channels, TwilioChannel::class);
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
            ->subject("Website Monitoring: " . $this->webMonitor->name . "  is currently DOWN. ")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('The monitor ' . $this->webMonitor->name . ' (' . $this->webMonitor->url . ')  is currently DOWN. ')
            ->line('You should check the issue right away! [ERROR]')
            ->line('Event timestamp: ' . Carbon::now() . '')
            ->line('GAannotations will alert you when it is back up. ');
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->title("The monitor " . $this->webMonitor->name . " (" . $this->webMonitor->url . ")  is currently DOWN. You should check the issue right away! [ERROR]")
            ->body("Event timestamp: " . Carbon::now());
    }

    public function toTwilio($notifiable)
    {
        return (new TwilioSmsMessage())
            ->content("The monitor " . $this->webMonitor->name . " (" . $this->webMonitor->url . ")  is currently DOWN. You should check the issue right away! [ERROR]\nEvent timestamp: " . Carbon::now());
    }
}
