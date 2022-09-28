<?php

namespace App\Listeners;

use App\Models\UserActiveDevice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Browser;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class UpdateUserSessionListener
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
        $event_type = $event->type; // web or ext
        $user = $event->user;
        $request = $event->request;
        $access_token_id = null;
        if($event_type == 'ext'){
            $access_token_id = DB::table('oauth_access_tokens')->where('user_id', $user->id)->orderBy('id', 'desc')->first();
            if($access_token_id){
                $access_token_id = $access_token_id->id;
            }
            else{
                $access_token_id = null;
            }
        }
        
        // try{
        //     UserActiveDevice::create([
        //         'user_id' => $user->id,
                
        //         'browser_name' => Browser::browserName(),
        //         'platform_name' => Browser::platformFamily(),
        //         'device_type' => Browser::platformName(),
    
        //         'is_extension' => ($event_type == 'ext') ? true : false,
        //         'ip' => $request->ip(),
    
        //         'session_id' => Session::getId() ?? null,
        //         'access_token_id' => $access_token_id,
    
        //     ]);
        // }
        // catch(Exception $ex){
        //     info(print_r($ex->getMessage()));
        // }
        
    }
}
