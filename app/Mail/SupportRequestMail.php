<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupportRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $details;
    public $fileLocation;
    public $fileExtension;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, string $details, string $fileLocation = null, string $fileExtension = null)
    {
        $this->user = $user;
        $this->details = $details;
        $this->fileLocation = $fileLocation;
        $this->fileExtension = $fileExtension;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $r = $this->view('mails/user/support-request')
            ->subject('Support requested received from ' . $this->user->name);

        if($this->fileLocation !== null) $r->attach($this->fileLocation, ['as' => 'attachment.' . $this->fileExtension]);
        
        return $r;
    }
}
