<?php

namespace App\Listeners;

use App\Mail\AdminNewUserRegisterMail;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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
        $admins = Admin::get();
        try {
            foreach($admins as $admin) {
                Mail::to($admin)->cc('ron@crystallball.pro')->send(new AdminNewUserRegisterMail($admin, $event->user));
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }
      
    }
}
