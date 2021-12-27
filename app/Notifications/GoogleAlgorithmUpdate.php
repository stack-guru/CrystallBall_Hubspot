<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class GoogleAlgorithmUpdate extends Notification
{
    use Queueable;

    public $googleAlgorithmUpdate;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        $this->googleAlgorithmUpdate = $googleAlgorithmUpdate;
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

        $notificationSetting = $notifiable->notificationSettingFor("google_algorithm_updates");

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
        $this->logNotificationTrigger($notifiable->id, $this->googleAlgorithmUpdate->id, get_class(), 'Mail');

        return (new MailMessage)
            ->subject("New Google Algorithm Update.")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('There is a new Google Algorithm Update. ')
            ->line('We added an annotation for you. We will try to send you more information about this Google Update soon. ');
    }

    public function toPushNotification($notifiable)
    {
        $this->logNotificationTrigger($notifiable->id, $this->googleAlgorithmUpdate->id, get_class(), 'PushNotification');

        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->link($this->googleAlgorithmUpdate->url)
            ->title("There is a new Google Algorithm Update. ")
            ->body("");
    }
}
