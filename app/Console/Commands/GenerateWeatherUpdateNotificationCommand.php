<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\OpenWeatherMapAlert;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use App\Notifications\WordpressUpdate as WordpressUpdateNotification;

class GenerateWeatherUpdateNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:generate-weather-update-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will generate events if there is any weather update for users.';

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
        $wordPressUpdates = OpenWeatherMapAlert::where('update_date', Carbon::now()->format('Y-m-d'))->get();
        if(count($wordPressUpdates)){
            print "Sending wordpress update notification of " . count($wordPressUpdates) . " event(s).\n";
            foreach ($wordPressUpdates as $index => $wordPressUpdate) {
                $users = User::select('users.*')
                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'wordpress_updates')
                    ->where('notification_settings.is_enabled', true)
                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new WordpressUpdateNotification($wordPressUpdate));
            }
            print "Notification sent successfully!\n";
        }else{
            print "No user has enabled this notification.\n";
        }
    }
}
