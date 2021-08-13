<?php

namespace App\Console\Commands;

use App\Models\GoogleAlert;
use App\Models\User;
use App\Notifications\GoogleAlert as GoogleAlertNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class GenerateGoogleAlertNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:generate-google-alert-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will generate events if there is any google alert for users.';

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
        $googleAlerts = GoogleAlert::where('alert_date', Carbon::now()->format('Y-m-d'))->get();
        if (count($googleAlerts)) {
            print "Sending google alert notification of " . count($googleAlerts) . " alert(s).\n";
            foreach ($googleAlerts as $index => $googleAlert) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('google_alerts', 'google_alerts.tag_name', 'user_data_sources.value')
                    ->where('google_alerts.id', $googleAlert->id)
                    ->get();

                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new GoogleAlertNotification($googleAlert));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }
    }
}
