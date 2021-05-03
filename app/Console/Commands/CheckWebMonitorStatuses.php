<?php

namespace App\Console\Commands;

use App\Models\WebMonitor;
use App\Services\UptimeRobotService;
use Carbon\Carbon;
use Illuminate\Console\Command;

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
    protected $description = 'This command will fetch monitor statuses using web monitors';

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
        $uptimeMonitors = $uptimeRobotService->getMonitors()['monitors'];

        foreach ($uptimeMonitors as $uptimeMonitor) {
            $webMonitor = WebMonitor::where('uptime_robot_id', $uptimeMonitor['id'])->first();
            if ($webMonitor) {
                if ($webMonitor->last_status != $uptimeMonitor['status']) {
                    // There is a change in monitor status
                    // 0 Paused
                    // 2 Up
                    // 9 Down
                    //   Started
                    switch ($uptimeMonitor['status']) {
                        case 0:
                            //Paused

                            break;
                        case 2:
                            // Up
                            break;
                        case 9:
                            // Down
                            break;
                    }
                }
                WebMonitor::where('uptime_robot_id', $uptimeMonitor['id'])->update([
                    'last_status' => $uptimeMonitor['status'],
                    'last_synced_at' => Carbon::now(),
                ]);
            }
        }
    }
}
