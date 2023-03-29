<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

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

        $data = [
            'id'   => $this->user->getKey(),
            'hash' => sha1($this->user->getEmailForVerification()),
        ];
        $link = URL::temporarySignedRoute('verification.verify', Carbon::now()->addDays(10), $data);
        return $this->view('mails/user/userInvite')
            ->subject($this->user->user->name . " has invited you to join them in " . config('app.name'))
            ->with('user', $this->user)
            ->with('verificationLink', $link);
    }
}
