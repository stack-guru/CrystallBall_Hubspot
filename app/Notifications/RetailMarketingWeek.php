<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Notification;

class RetailMarketingWeek extends Notification
{
    use Queueable;

    public $retailMarketing;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(\App\Models\RetailMarketing $retailMarketing)
    {
        $this->retailMarketing = $retailMarketing;
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

        $notificationSetting = $notifiable->notificationSettingFor("retail_marketing_dates");

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
        $this->logNotificationTrigger($notifiable->id, $this->retailMarketing->id, get_class(), 'Mail');

        return (new MailMessage)
            ->subject("Retail Marketing Day (in 7 days): " . $this->retailMarketing->event_name)
            ->greeting('Hi ' . $notifiable->name . ',')
            ->line('In seven days, it is ' . $this->retailMarketing->event_name . '.')
            ->line('Get the most of it by doing the proper adaptations on your site or sending an email.')
            ->line('Check out our email templates <a href="https://www.crystalballinsight.com/email-templates-retail-marketing-dates">HERE</a>, feel free to use them ;)');
    }
}
