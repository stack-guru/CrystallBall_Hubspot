<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;

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
        if(! $notificationSetting) return [];
        if(! $notificationSetting->is_enabled) return [];

        if($notificationSetting->email_on_event_day) array_push($channels, "mail");

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
                    ->subject("New Annotation for [API_KEY_NAME]")
                    ->greeting('Hi [NAME],')
                    ->line('A new annotation was received from the API KEY: [API_KEY_NAME]');
    }

}