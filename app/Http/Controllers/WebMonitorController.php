<?php

namespace App\Http\Controllers;

use App\Http\Requests\WebMonitorRequest;
use App\Models\WebMonitor;
use App\Services\UptimeRobotService;
use Auth;
use Illuminate\Http\Request;

class WebMonitorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ['web_monitors' => WebMonitor::ofCurrentUser()->get()];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(WebMonitorRequest $request)
    {
        $uptimeRobotService = new UptimeRobotService;
        $uRM = $uptimeRobotService->newMonitor($request->name, $request->url);

        if ($uRM == false) {
            abort(500);
        }

        $webMonitor = new WebMonitor;
        $webMonitor->fill($request->validated());
        $webMonitor->user_id = Auth::id();
        $webMonitor->save();

        $webMonitor->uptime_robot_id = $uRM['monitor']['id'];
        $webMonitor->save();

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
        $uRM = $uptimeRobotService->deleteMonitor($webMonitor->uptime_robot_id);

        if ($uRM == false) {
            abort(500);
        }

        $webMonitor->delete();

        return ['success' => true];
    }
}
