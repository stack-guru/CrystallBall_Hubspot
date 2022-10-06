<?php

namespace App\Listeners;

use App\Events\AnnotationCreated;
use App\Jobs\RunZapierHookForCreatedAnnotation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\UserWebhook;

// This listener triggers API to zapier and can be queued. But the underlying 
// job is already queued that's why it is unnecessary to queue this listener
// as well.
class TriggerZapierWebHooks
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
     * @param  AnnotationCreated  $event
     * @return void
     */
    public function handle(AnnotationCreated $event)
    {
        $user = $event->annotation->user;
        if(isset($user)){
            $userWebhooks = UserWebhook::where('user_id', $user->id)->get();

            foreach ($userWebhooks as $userWebhook) {
                RunZapierHookForCreatedAnnotation::dispatch($event->annotation->withoutRelations(), $userWebhook);
            }
        }
        
    }
}
