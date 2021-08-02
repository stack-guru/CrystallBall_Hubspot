<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\OpenWeatherMapAlert;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use App\Notifications\OpenWeatherMapAlert as OpenWeatherMapAlertNotification;

class GenerateWeatherUpdateNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:generate-weather-alert-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will generate events if there is any weather alert for users.';

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
        $openWeatherMapAlerts = OpenWeatherMapAlert::where('alert_date', Carbon::now()->format('Y-m-d'))->get();
        if(count($openWeatherMapAlerts)){
            print "Sending open weather map alert notification of " . count($openWeatherMapAlerts) . " event(s).\n";
            foreach ($openWeatherMapAlerts as $index => $OpenWeatherMapAlert) {
                $users = User::select('users.*')
                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'weather_alerts')
                    ->where('notification_settings.is_enabled', true)

                    ->join('user_data_sources as uds', 'uds.open_weather_map_city_id' , 'open_weather_map_alerts.open_weather_map_city_id')
                    ->join('user_data_sources as owmes', 'owmes.open_weather_map_event', 'open_weather_map_alerts.event')
                    ->join('open_weather_map_cities', 'open_weather_map_cities.id' , 'open_weather_map_alerts.open_weather_map_city_id')

                    ->where('uds.ds_code', 'open_weather_map_cities')
                    ->where('uds.user_id', 'users.id')
                    ->where('owmes.user_id', 'users.id')
                    
                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new OpenWeatherMapAlertNotification($OpenWeatherMapAlert));
            }
            print "Notification sent successfully!\n";
        }else{
            print "No notification to send.\n";
        }
    }
}
