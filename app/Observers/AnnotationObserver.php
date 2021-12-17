<?php

namespace App\Observers;

use App\Models\Annotation;
use Illuminate\Support\Facades\Auth;

class AnnotationObserver
{
    /**
     * Handle the Annotation "created" event.
     *
     * @param  \App\Models\Annotation  $annotation
     * @return void
     */
    public function created(Annotation $annotation)
    {
        $user = Auth::user();
        if ($user->annotations_count) $user->annotations_count++;
        else $user->annotations_count = 1;
        $user->save();
    }

    /**
     * Handle the Annotation "updated" event.
     *
     * @param  \App\Models\Annotation  $annotation
     * @return void
     */
    public function updated(Annotation $annotation)
    {
        //
    }

    /**
     * Handle the Annotation "deleted" event.
     *
     * @param  \App\Models\Annotation  $annotation
     * @return void
     */
    public function deleted(Annotation $annotation)
    {
        $user = Auth::user();
        if ($user->annotations_count) $user->annotations_count--;
        else $user->annotations_count = 0;
        $user->save();
    }
}
