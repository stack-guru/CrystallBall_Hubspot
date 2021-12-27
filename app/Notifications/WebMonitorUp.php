<?php

namespace App\Notifications;

use Illuminate\Support\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

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
        $this->logNotificationTrigger($notifiable->id, $this->webMonitor->id, get_class(), 'Mail');

        return (new MailMessage)
            ->subject("Website Monitoring: " . $this->webMonitor->name . "  is back UP")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('The monitor ' . $this->webMonitor->name . ' (' . $this->webMonitor->url . ')  is back UP (It was down for ' . Carbon::now()->diffForHumans($this->webMonitor->updated_at, CarbonInterface::DIFF_ABSOLUTE) . ').')
            ->line('Event timestamp: ' . Carbon::now());
    }

    public function toPushNotification($notifiable)
    {
        $this->logNotificationTrigger($notifiable->id, $this->webMonitor->id, get_class(), 'PushNotification');

        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->link($this->webMonitor->url)
            ->title("The monitor " . $this->webMonitor->name . " (" . $this->webMonitor->url . ")  is back UP (It was down for " . Carbon::now()->diffForHumans($this->webMonitor->updated_at, CarbonInterface::DIFF_ABSOLUTE) . ").")
            ->body("Event timestamp: " . Carbon::now());
    }

    public function toTwilio($notifiable)
    {
        $this->logNotificationTrigger($notifiable->id, $this->webMonitor->id, get_class(), 'Twilio');

        return (new TwilioSmsMessage())
            ->content("The monitor " . $this->webMonitor->name . " (" . $this->webMonitor->url . ")  is back UP (It was down for " . Carbon::now()->diffForHumans($this->webMonitor->updated_at, CarbonInterface::DIFF_ABSOLUTE) . ").\nEvent timestamp: " . Carbon::now());
    }
}
