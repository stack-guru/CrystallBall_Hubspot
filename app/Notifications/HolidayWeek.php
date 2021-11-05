<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HolidayWeek extends Notification
{
    use Queueable;

    public $holiday;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\Holiday $holiday)
    {
        $this->holiday = $holiday;
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

        $notificationSetting = $notifiable->notificationSettingFor("holidays");

        if (!$notificationSetting) {
            return [];
        }

        if (!$notificationSetting->is_enabled) {
            return [];
        }

        if ($notificationSetting->email_seven_days_before) {
            array_push($channels, "mail");
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
        $mailMessage = (new MailMessage)
            ->subject("Holidays (in 7 days): " . $this->holiday->event_name)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('In seven days, it is ' . $this->holiday->event_name . '.')
            ->line('Get the most of it by doing the proper adaptations on your site or sending an email.')
            ->line('Check out our email templates <a href="https://www.gaannotations.com/blog/categories/holidays-templates">HERE</a>, feel free to use them ;)');

        if ($this->holiday->url) {
            $mailMessage->line('Learn more about this Holiday <a href="' . $this->holiday->url . '">HERE</a>.');
        }

        return $mailMessage;
    }

}
