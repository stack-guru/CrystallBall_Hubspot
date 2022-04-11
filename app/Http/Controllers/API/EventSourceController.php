<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Annotation;
use Illuminate\Support\Facades\Auth;

class EventSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $annotationEvents = Annotation::ofCurrentUser()
            ->orderBy('event_name', 'ASC')
            ->distinct()
            ->get(['id', 'event_type', 'event_name']);

        $fEvents = [];
        foreach ($annotationEvents as $aEvent) {
            array_push($fEvents, [
                "_id" => $aEvent->id,
                "name" => $aEvent->event_name,
                "type" => $aEvent->event_type,
                "scope" => "private",
                "categories" => [
                    "Shared",
                ],
            ]);
        }
        return ['eventSources' => $fEvents];
    }
}
