<?php

namespace App\Http\Controllers\Admin;

use App\Models\OWMPushNotification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OWMPushNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $oWMPushNotifications = OWMPushNotification::select('id', 'shape', 'event_name', 'alert_type', 'urgency', 'severity', 'certainty')->paginate(100);
        return view('admin/data-source/owm-push-notification/index')->with('oWMPushNotifications', $oWMPushNotifications);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\OWMPushNotification  $oWMPushNotification
     * @return \Illuminate\Http\Response
     */
    public function show(OWMPushNotification $oWMPushNotification)
    {
        return view('admin/data-source/owm-push-notification/show')->with('oWMPushNotification', $oWMPushNotification);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\OWMPushNotification  $oWMPushNotification
     * @return \Illuminate\Http\Response
     */
    public function destroy(OWMPushNotification $oWMPushNotification)
    {
        $oWMPushNotification->delete();
        return redirect()->back()->with('success', true);
    }
}
