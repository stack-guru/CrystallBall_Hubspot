<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mails/user/userInvite')
            ->subject($this->user->user->name . " has invited you to join them in " . config('app.name'))
            ->with('user', $this->user)
            ->with('password', $this->password);
    }
}
