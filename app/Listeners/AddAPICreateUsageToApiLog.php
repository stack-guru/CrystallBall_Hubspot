<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\ApiLog;
use Carbon\Carbon;

class AddAPICreateUsageToApiLog
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
        $user = $event->user;
        $request = request();

        $apiLog = new ApiLog;
        $apiLog->event_name  = "AnnotationCreated";
        $apiLog->user_id  = $user->id;
        $apiLog->ip_address  = $request->ip();
        $apiLog->bearer_token  = $request->bearerToken();
        $apiLog->created_at  = Carbon::now();
        $apiLog->save();
    }
}
