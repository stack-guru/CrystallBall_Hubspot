<?php

namespace App\Listeners;

use Laravel\Passport\Events\AccessTokenCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use Carbon\Carbon;
use DB;

class APITokenCreated
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
     * @param  AccessTokenCreated  $event
     * @return void
     */
    public function handle(AccessTokenCreated $event)
    {
        $token = DB::table("oauth_access_tokens")->where('id', $event->tokenId)->first();

        // This logic is not good. But it is working and have very less chances to break.
        // Feel free to comment this out and write your own logic here.
        if(strpos($token->name, "API Login at ")){
            $user = User::find($event->userId);
            $user->last_generated_api_token_at = Carbon::now();
            $user->save();
        }
    }
}
