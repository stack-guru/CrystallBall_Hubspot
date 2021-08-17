<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class VerifyPhone extends Notification
{

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return [TwilioChannel::class];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toTwilio($notifiable)
    {
        $verificationCode = $this->verificationCode($notifiable);

        return $this->buildPhoneMessage($verificationCode);
    }

    /**
     * Get the verify phone notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildPhoneMessage($verificationCode)
    {
        return (new TwilioSmsMessage())
            ->content("$verificationCode is your GAannotations verification code. It is only valid for 30 minutes.");
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationCode($notifiable)
    {
        $phoneVerificationCode = rand(100000, 999999);
        $notifiable->phone_verification_code = bcrypt($phoneVerificationCode);
        $notifiable->phone_verification_expiry = Carbon::now()->addMinutes(30);
        $notifiable->save();
        return $phoneVerificationCode;
    }

}
