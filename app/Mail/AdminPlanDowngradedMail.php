<?php

namespace App\Mail;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminPlanDowngradedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $admin;
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Admin $admin, User $user)
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
        return $this->subject($this->user->name . " downgraded his/her plan!")
            ->view('mails/admin/planDowngraded')
            ->with('admin', $this->admin)
            ->with('user', $this->user);
    }
}
