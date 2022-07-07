<?php

namespace App\Console\Commands;

use App\Models\Annotation;
use App\Models\WebMonitorAnnotation;
use App\Models\User;
use App\Models\WebMonitor;
use App\Notifications\WebMonitorDown;
use App\Notifications\WebMonitorUp;
use App\Services\UptimeRobotService;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class CheckWebMonitorStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:check-monitor-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch monitor statuses using web monitors';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $uptimeRobotService = new UptimeRobotService;
        $uptimeMonitors = $uptimeRobotService->getAllMonitors()['monitors'];

        if (is_array($uptimeMonitors)) {

            foreach ($uptimeMonitors as $uptimeMonitor) {
                // // This code is here for debugging purposes. It will allow you to generate notification for a specific web monitor
                // $this->info($uptimeMonitor['friendly_name'] . ' of URL ' . $uptimeMonitor['url'] . ' is ' . $uptimeMonitor['status']);
                // if ($uptimeMonitor['friendly_name'] == 'ABC') {
                //     if ($uptimeMonitor['status'] == 9) {
                //         $uptimeMonitor['status'] = 2;
                //     } else {
                //         $uptimeMonitor['status'] = 9;
                //     }
                // }
                $webMonitor = WebMonitor::where('uptime_robot_id', $uptimeMonitor['id'])->first();
                if ($webMonitor) {
                    $rightNowDateTime = Carbon::now();
                    if ($webMonitor->last_status != $uptimeMonitor['status']) {
                        $users = User::select('users.*')
                            ->join('web_monitors', 'web_monitors.user_id', 'users.id')
                            ->where('web_monitors.id', $webMonitor->id)
                            ->get();
                        // There is a change in monitor status
                        // 0 Paused
                        // 1 Started
                        // 2 Up
                        // 9 Down
                        $event = "";
                        $description = "";
                        switch ($uptimeMonitor['status']) {
                            case 0:
                                //Paused
                                $event = "Monitor Paused";
                                $description = "The website $webMonitor->url is paused. At $rightNowDateTime";
                                break;
                            case 1:
                                //Started
                                $event = "Monitor Started";
                                $description = "The website $webMonitor->url is being monitored. At $rightNowDateTime";
                                break;
                            case 2:
                                // Up
                                $event = "Site Online";
                                $description = "The website $webMonitor->url is back online. At $rightNowDateTime";
                                try {
                                    Notification::send($users, new WebMonitorUp($webMonitor));
                                } catch (\Exception $e) {
                                    Log::error($e);
                                }
                                break;
                            case 9:
                                // Down
                                $event = "Site Down";
                                $description = "The website $webMonitor->url it's down. At $rightNowDateTime";
                                try {
                                    Notification::send($users, new WebMonitorDown($webMonitor));
                                } catch (\Exception $e) {
                                    Log::error($e);
                                }
                                break;
                            default:
                                $event = "Unknown Monitor status: " . $uptimeMonitor['status'];
                                $description = "The website $webMonitor->url turned into unknown status. At $rightNowDateTime";
                        }

                        $userIds = WebMonitor::select('user_id')
                            ->where('uptime_robot_id', $uptimeMonitor['id'])
                            ->distinct()
                            ->get()
                            ->pluck('user_id')
                            ->toArray();

                        foreach ($userIds as $userId) {
                            $webMonitorAnnotation = new WebMonitorAnnotation;
                            $webMonitorAnnotation->web_monitor_id = $webMonitor->id;
                            $webMonitorAnnotation->user_id = $userId;
                            $webMonitorAnnotation->category = "Website Monitoring";
                            $webMonitorAnnotation->event_name = $event;
                            $webMonitorAnnotation->description = $description;
                            $webMonitorAnnotation->show_at = $rightNowDateTime;
                            $webMonitorAnnotation->save();
                            event(new \App\Events\AnnotationCreated($webMonitorAnnotation));
                        }
                    }
                    WebMonitor::where('uptime_robot_id', $uptimeMonitor['id'])->update([
                        'last_status' => $uptimeMonitor['status'],
                        'last_synced_at' => $rightNowDateTime,
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }
    }
}
