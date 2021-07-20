<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\UserDataSource;

class SeedUserDataSource
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

        $userDataSource = new UserDataSource;
        $userDataSource->user_id = $user->id;
        $userDataSource->ds_code = 'wordpress_updates';
        $userDataSource->ds_name = 'WordpressUpdate';
        $userDataSource->country_name = null;
        $userDataSource->retail_marketing_id = null;
        $userDataSource->value = 'last year';
        $userDataSource->save();
    }
}
