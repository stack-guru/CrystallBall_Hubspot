<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OWMPushNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
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

        $host = $request->getHttpHost();
        // if($host !== "openweathermap.org") abort(404);
        // if(! $request->has('alert')) abort(422);

        // $alert = json_decode($request->alert, false);
        $alert = $request->alert;

        $aStartDate = Carbon::parse(date("Y-m-d", $request->start));
        $aEndDate = Carbon::parse(date("Y-m-d", $request->end));
        $totalDays = ($aEndDate->diffInDays($aStartDate)) + 2;
        for ($i = 0; $i < $totalDays; $i++) {

            $oWMPushNotification = new OWMPushNotification;

            $oWMPushNotification->owm_alert_id = $alert['id'];
            $oWMPushNotification->shape = $alert['geometry']['type'];
            $oWMPushNotification->location_coordinates = json_encode($alert['geometry']['coordinates']);

            $oWMPushNotification->alert_type = $request->msg_type;
            $oWMPushNotification->categories = json_encode($request->categories);
            $oWMPushNotification->urgency = $request->urgency;
            $oWMPushNotification->severity = $request->severity;
            $oWMPushNotification->certainty = $request->certainty;

            $t = Carbon::parse($aStartDate);
            $oWMPushNotification->alert_date = $t->addDays($i);

            $oWMPushNotification->sender_name = $request->sender;
            $oWMPushNotification->event = $request->description[0]['event'];
            $oWMPushNotification->headline = $request->description[0]['headline'];
            $oWMPushNotification->description = $request->description[0]['description'];

            //$oWMPushNotification->open_weather_map_city_id = $alert['a'];
            $oWMPushNotification->save();
        }
    }

}
