<?php

namespace App\Mail;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminPlanUpgradedMail extends Mailable
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
        return $this->subject($this->user->name . " upgraded his/her plan!")
            ->view('mails/admin/planUpgraded')
            ->with('admin', $this->admin)
            ->with('user', $this->user);
    }
}
