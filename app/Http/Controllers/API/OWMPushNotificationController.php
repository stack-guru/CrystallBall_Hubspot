<?php

namespace App\Http\Controllers\API;

use App\Models\OWMPushNotification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;


class OWMPushNotificationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        Log::channel('open_weather_map')->debug($request->all());

        // $host = $request->getHttpHost();
        // // if($host !== "openweathermap.org") abort(404);
        // // if(! $request->has('alert')) abort(422);
        // $alert = json_decode($request->alert, false);

        // $oWMPushNotification = new OWMPushNotification;
        // $oWMPushNotification->owm_alert_id = $alert->id;
        // $oWMPushNotification->shape = $alert->geometry->type;
        // $oWMPushNotification->location_coordinates = json_encode($alert->geometry->coordinates);
        // $oWMPushNotification->alert_type = $alert->a;
        // $oWMPushNotification->categories = $alert->a;
        // $oWMPushNotification->urgency = $alert->a;
        // $oWMPushNotification->severity = $alert->a;
        // $oWMPushNotification->certainity = $alert->a;
        // $oWMPushNotification->alert_date = $alert->a;
        // $oWMPushNotification->sender_name = $alert->a;
        // $oWMPushNotification->event = $alert->a;
        // $oWMPushNotification->headline = $alert->a;
        // $oWMPushNotification->description = $alert->a;

        // $oWMPushNotification->open_weather_map_city_id = $alert->a;
        // $oWMPushNotification->save();

    }

}
