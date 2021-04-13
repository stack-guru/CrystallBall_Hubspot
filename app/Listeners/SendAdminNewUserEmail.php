<?php

namespace App\Listeners;

use App\Mail\AdminNewUserRegisterMail;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class SendAdminNewUserEmail
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
        $admin = Admin::first();
        Mail::to($admin)->send(new AdminNewUserRegisterMail($admin, $event->user));
    }
}