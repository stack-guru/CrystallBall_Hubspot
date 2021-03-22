<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Auth;
use App\Models\LoginLog;

class LoginListener
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
        // This if will prevent logging of logins done by admin
        if(Auth::id())
        {
            $loginLog = new LoginLog;
            $loginLog->user_id = Auth::guard('web')->id();
            $loginLog->ip_address = request()->ip();
            $loginLog->save();
        }
    }
}
