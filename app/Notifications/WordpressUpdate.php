<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class WordpressUpdate extends Notification
{
    use Queueable;

    public $wordPressUpdate;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\WordpressUpdate $wordPressUpdate)
    {
        $this->wordPressUpdate = $wordPressUpdate;
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

        $notificationSetting = $notifiable->notificationSettingFor("wordpress_updates");

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
        $this->logNotificationTrigger($notifiable->id, $this->wordPressUpdate->id, get_class(), 'Mail');

        return (new MailMessage)
            ->subject("New WordPress Update.")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('There is a new WordPress Update.')
            ->line('We added an annotation for you. Check out what’s new ' . $this->wordPressUpdate->url);
    }

    public function toPushNotification($notifiable)
    {
        $this->logNotificationTrigger($notifiable->id, $this->wordPressUpdate->id, get_class(), 'PushNotification');

        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->link($this->wordPressUpdate->url)
            ->title("There is a new WordPress Update.")
            ->body("");
    }
}
