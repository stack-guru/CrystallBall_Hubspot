<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminUserSuspendedAccount extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $admin;
    public $user;
    public $suspensionFeedback;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($admin, $user, $suspensionFeedback)
    {
        $this->admin = $admin;
        $this->user = $user;
        $this->suspensionFeedback = $suspensionFeedback;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->user->name . " suspended account!")
            ->view('mails/admin/userSuspendedAccount')
            ->with('admin', $this->admin)
            ->with('user', $this->user)
            ->with('suspensionFeedback', $this->suspensionFeedback);
    }
}
