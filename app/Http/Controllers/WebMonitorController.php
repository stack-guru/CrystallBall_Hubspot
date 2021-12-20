<?php

namespace App\Http\Controllers;

use App\Http\Requests\WebMonitorRequest;
use App\Models\WebMonitor;
use App\Services\UptimeRobotService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class WebMonitorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->query('ga_property_id') !== "null") {
            return ['web_monitors' => WebMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->where('ga_property_id', $request->query('ga_property_id'))->get()];
        }
        return ['web_monitors' => WebMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->get()];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(WebMonitorRequest $request)
    {

        $pricePlan = Auth::user()->pricePlan;
        $webMonitorsCount = WebMonitor::ofCurrentUser()->count();

        if ($pricePlan->web_monitor_count <= $webMonitorsCount) {
            return response()->json(['message' => 'Maximum number of monitors limit reached'], 402);
        }

        if (WebMonitor::where('url', $request->url)->where('user_id', Auth::id())->count()) {
            return response()->json(['message' => 'We already have this monitor setup.'], 402);
        }

        $webMonitor = new WebMonitor;
        $webMonitor->fill($request->validated());
        $webMonitor->user_id = Auth::id();

        $uptimeRobotService = new UptimeRobotService;

        $anyOldMonitor = WebMonitor::where('url', $webMonitor->url)->whereNotNull('uptime_robot_id')->first();
        if ($anyOldMonitor) {
            $webMonitor->uptime_robot_id = $anyOldMonitor->uptime_robot_id;
        } else {
            $uRM = $uptimeRobotService->newMonitor($request->name, $request->url);
            if ($uRM == false) {
                abort(500, "Expected response received from Monitor Server");
            }
            $webMonitor->uptime_robot_id = $uRM['monitor']['id'];
        }

        $webMonitor->save();

        $webMonitor->load('googleAnalyticsProperty');

        return ['web_monitor' => $webMonitor];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\WebMonitor  $webMonitor
     * @return \Illuminate\Http\Response
     */
    public function update(WebMonitorRequest $request, WebMonitor $webMonitor)
    {
        $webMonitor->fill($request->validated());
        $webMonitor->save();

        return ['web_monitor' => $webMonitor];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\WebMonitor  $webMonitor
     * @return \Illuminate\Http\Response
     */
    public function destroy(WebMonitor $webMonitor)
    {

        $uptimeRobotService = new UptimeRobotService;
        $anyOldMonitor = WebMonitor::where('uptime_robot_id', $webMonitor->uptime_robot_id)->where('id', '<>', $webMonitor->id)->first();
        if (!$anyOldMonitor) {
            $uptimeRobotService->deleteMonitor($webMonitor->uptime_robot_id);
        }

        $webMonitor->delete();

        return ['success' => true];
    }
}
