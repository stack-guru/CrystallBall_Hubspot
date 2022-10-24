<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WebMonitor;
use App\Services\UptimeRobotService;

class WebMonitorController extends Controller
{
    public function index(){
        $webMonitors = WebMonitor::with(['user:id,email'])->get();
        $activeWebMonitorsCount = WebMonitor::whereNotNull('uptime_robot_id')->count();

        return view('admin/web-monitors/index')->with('webMonitors', $webMonitors)->with('activeWebMonitorsCount', $activeWebMonitorsCount);
    }

    public function destroy(WebMonitor $webMonitor,UptimeRobotService $uptimeRobotService){
        $uptimeRobotService->deleteMonitor($webMonitor->uptime_robot_id);
        $webMonitor->delete();
        return redirect()->back()->with('success', $webMonitor->name.' deleted successfully!');
    }
}
