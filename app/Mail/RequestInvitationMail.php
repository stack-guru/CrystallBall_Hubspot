<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RequestInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    private $user;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $admin)
    {
        $this->user = $user;
        $this->admin = $admin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $userEmail = $this->user->email;
        return $this->subject("$userEmail wants to join Crystal Ball (GAannotations)")->markdown('mails.auth.request-invite', [
            'user' => $this->user,
            'admin' => $this->admin,
            'addMemberLink' => config('app.url') . '/settings/user'
        ]);
    }
}
