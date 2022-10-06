<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Annotation;

class AnnotationCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $annotation;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($annotation)
    {
        $this->annotation = $annotation;

        $user = $annotation->user;
        if (isset($user) && $user->isPricePlanAnnotationLimitReached(true)) {
            event(new AnnotationsLimitReached($user));
        }
    }
}
