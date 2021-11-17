<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AddSampleAnnotation
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

        // event_name:
        // Sample Annotation
        // category:
        // GAannotations
        // description:
        // This is an example to show you how looks the annotations
        // Date:
        // [Two_days_before_user_registration_date]

        $user->annotations()->create([
            'category' => config('app.name'),
            'event_name' => 'Sample Annotation',
            'url' => route('annotation.index'),
            'description' => 'This is an annotation example',
            'show_at' => new \DateTime('-02 days'),
            'is_enabled' => true,
        ]);
    }
}
