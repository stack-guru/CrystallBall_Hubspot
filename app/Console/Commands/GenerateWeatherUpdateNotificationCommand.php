<?php

namespace App\Console\Commands;

use App\Models\OpenWeatherMapAlert;
use App\Models\User;
use App\Models\UserDataSource;
use App\Notifications\OpenWeatherMapAlert as OpenWeatherMapAlertNotification;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

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
    protected $description = 'Generate events if there is any weather alert for users.';

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
        $openWeatherMapAlerts = OpenWeatherMapAlert::with('openWeatherMapCity')->where('alert_date', Carbon::now()->format('Y-m-d'))->get();
        if (count($openWeatherMapAlerts)) {
            print "Sending open weather map alert notification of " . count($openWeatherMapAlerts) . " event(s).\n";
            foreach ($openWeatherMapAlerts as $index => $openWeatherMapAlert) {
                $users = User::whereIn(
                    'id',
                    OpenWeatherMapAlert::select('user_data_sources.user_id')
                        ->distinct()
                        ->join('user_data_sources', 'user_data_sources.open_weather_map_city_id', 'open_weather_map_alerts.open_weather_map_city_id')
                        ->join('user_data_sources as uds2', 'uds2.open_weather_map_event', 'open_weather_map_alerts.event')
                        ->join('notification_settings', 'user_data_sources.user_id', 'notification_settings.user_id')

                        ->whereRaw('user_data_sources.user_id = uds2.user_id')
                        ->where('open_weather_map_alerts.id', $openWeatherMapAlert->id)
                        ->where('notification_settings.name', 'weather_alerts')
                        ->where('notification_settings.is_enabled', true)
                        ->get()->pluck('user_id')->toArray()
                )->get();

                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new OpenWeatherMapAlertNotification($openWeatherMapAlert));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }
    }
}
