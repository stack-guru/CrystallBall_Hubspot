<?php

namespace App\Mail;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminFailedAttemptMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $admin;
    public $user;
    public $text;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Admin $admin, User $user,$text)
    {
        $this->admin = $admin;
        $this->user = $user;
        $this->text = $text;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Failed Attempts To Bill For ".$this->user->name)
            ->view('mails/admin/failedAttempt')
            ->with('admin', $this->admin)
            ->with('user', $this->user)
            ->with('text', $this->text);
    }
}
