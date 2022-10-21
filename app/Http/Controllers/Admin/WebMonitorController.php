<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WebMonitor;

class WebMonitorController extends Controller
{
    public function index(){
        $webMonitors = WebMonitor::with(['user:id,email'])->get();
        $activeWebMonitorsCount = WebMonitor::whereNotNull('uptime_robot_id')->count();

        return view('admin/web-monitors/index')->with('webMonitors', $webMonitors)->with('activeWebMonitorsCount', $activeWebMonitorsCount);
    }
}
