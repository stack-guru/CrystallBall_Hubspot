<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\GoogleAlgorithmUpdate;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use App\Notifications\GoogleAlgorithmUpdate as GoogleAlgorithmUpdateNotification;

class GenerateGoogleAlgorithmUpdateNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:generate-google-algorithm-update-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate events if there is any google algorithm update for users.';

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
        $googleUpdates = GoogleAlgorithmUpdate::where('update_date', Carbon::now()->format('Y-m-d'))->get();
        if(count($googleUpdates)){
            print "Sending google alert notification of " . count($googleUpdates) . " event(s).\n";
            foreach ($googleUpdates as $index => $googleUpdate) {
                $users = User::select('users.*')
                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'google_algorithm_updates')
                    ->where('notification_settings.is_enabled', true)
                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new GoogleAlgorithmUpdateNotification($googleUpdate));
            }
            print "Notification sent successfully!\n";
        }else{
            print "No notification to send.\n";
        }
    }
}
