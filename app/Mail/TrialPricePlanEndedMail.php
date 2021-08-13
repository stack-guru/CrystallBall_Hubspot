<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Queue\SerializesModels;

class TrialPricePlanEndedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Your current plan does not support properties on API")
            ->html(
                (new MailMessage)
                    ->line("Apologies! Your current plan doesn't support properties on API.")
                    ->line('Ask the admin of this account to upgrade and continue enjoying the GAannotations properties feature.')
                    ->render()
            );
    }
}
