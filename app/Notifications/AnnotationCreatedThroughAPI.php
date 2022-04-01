<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;
use Illuminate\Support\Facades\Auth;

class AnnotationCreatedThroughAPI extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
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

        $notificationSetting = $notifiable->notificationSettingFor("api");
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
        $this->logNotificationTrigger($notifiable->id, null, get_class(), 'Mail');

        return (new MailMessage)
            ->subject("New Annotation for " . Auth::user()->token()->name ?? "")
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('A new annotation was received from the API KEY: ' . Auth::user()->token()->name ?? "");
    }

    public function toPushNotification($notifiable)
    {
        $this->logNotificationTrigger($notifiable->id, null, get_class(), 'PushNotification');

        return PusherMessage::create()
            ->platform('web')
            ->web()
            ->sound('default')
            ->title("A new annotation was received from the API KEY: " . Auth::user()->token()->name ?? "")
            ->body("");
    }
}
