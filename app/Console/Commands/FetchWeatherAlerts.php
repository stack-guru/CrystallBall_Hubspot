<?php

namespace App\Console\Commands;

use App\Models\OpenWeatherMapAlert;
use App\Models\OpenWeatherMapCity;
use App\Services\OpenWeatherMapService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FetchWeatherAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-weather-alerts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will take all enabled cities and fetch their weather alerts from Open Weather Map One Call API';

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
        ini_set('max_execution_time', 7200);
        $totalCitiesWithAlertsCount = 0;
        $totalAlertsCount = 0;

        $enabledCities = OpenWeatherMapCity::select('open_weather_map_cities.id', 'open_weather_map_cities.name', 'open_weather_map_cities.owmc_id')
            ->join('user_data_sources', 'user_data_sources.open_weather_map_city_id', 'open_weather_map_cities.id')
            ->join('users', 'user_data_sources.user_id', 'users.id')
            ->where('user_data_sources.ds_code', 'open_weather_map_cities')
            ->where('users.is_ds_weather_alerts_enabled', true)
            ->orderBy('open_weather_map_cities.id')
            ->distinct()
            ->get();

        print "Processing " . count($enabledCities) . " cities.\n";
        $oWMService = new OpenWeatherMapService;
        foreach ($enabledCities as $city) {
            sleep(1);
            print "Fetching weather of " . $city->name . ".\n";
            $OCAResp = $oWMService->currentWeatherById($city->owmc_id);
            if ($OCAResp['success']) {
                $totalCitiesWithAlertsCount++;
                $weathers = $OCAResp['data']['weather'];
                foreach ($weathers as $weather) {
                    $doExist = OpenWeatherMapAlert::where('open_weather_map_city_id', $city->id)->where('event', $weather['main'])->where('alert_date', Carbon::now()->toDateString())->count() > 0;
                    if (!$doExist) {
                        $totalAlertsCount++;

                        $oWMAlert = new OpenWeatherMapAlert;
                        $oWMAlert->event = $weather['main'];
                        $oWMAlert->description = $weather['description'];
                        $oWMAlert->alert_date = Carbon::now();
                        $oWMAlert->open_weather_map_city_id = $city->id;
                        $oWMAlert->save();

                    }
                }
            } else {
                print "\n" . $OCAResp['message'] . ".\n";
            }
        }

        print count($enabledCities) . " cities processed.\n";
        print $totalCitiesWithAlertsCount . " cities with alerts.\n";
        print $totalAlertsCount . " total alerts.\n";

        return 0;
    }
}
