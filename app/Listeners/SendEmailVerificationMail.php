<?php

namespace App\Listeners;

use App\Mail\EmailVerificationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendEmailVerificationMail
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        try {
            if (!$event->user->hasVerifiedEmail()) Mail::to($event->user)->send(new EmailVerificationMail($event->user));
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
