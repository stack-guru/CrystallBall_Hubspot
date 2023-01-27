<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class AdminNewUserRegisterMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $admin;
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($admin, $user)
    {
        $this->admin = $admin;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if (!$this->user) {
            $this->user = (object) [
                'name' => "not found",
                'email' => "not found",
                'email_verified_at' => Carbon::now(),
                'phone_verified_at' => Carbon::now(),
                'password' => ''
            ];
        }
        return $this->subject($this->user->name . " just signed up!")
            ->view('mails/admin/newUserRegister')
            ->with('admin', $this->admin)
            ->with('user', $this->user);
    }
}
