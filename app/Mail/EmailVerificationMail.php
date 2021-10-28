<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Carbon;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    private $user;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject(Lang::get('Verify Email Address'))
            ->html(
                (new MailMessage)
                    ->line(Lang::get('Please click the button below to verify your email address.'))
                    ->action(Lang::get('Verify Email Address'), URL::temporarySignedRoute(
                        'verification.verify',
                        Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
                        [
                            'id' => $this->user->getKey(),
                            'hash' => sha1($this->user->getEmailForVerification()),
                        ]
                    ))
                    ->line(Lang::get('If you did not create an account, no further action is required.'))
                    ->render()
            );
    }
}
