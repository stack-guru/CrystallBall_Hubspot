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
        ini_set('max_execution_time', 1800);
        $totalCitiesWithAlertsCount = 0;
        $totalAlertsCount = 0;

        $enabledCities = OpenWeatherMapCity::select('open_weather_map_cities.id', 'open_weather_map_cities.longitude', 'open_weather_map_cities.latitude')
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
            $OCAResp = $oWMService->oneCallApi($city->latitude, $city->longitude);
            if ($OCAResp['success']) {
                if (array_key_exists('alerts', $OCAResp['data'])) {
                    $totalCitiesWithAlertsCount++;
                    $alerts = $OCAResp['data']['alerts'];
                    foreach ($alerts as $alert) {
                        $totalAlertsCount++;
                        $aStartDate = Carbon::parse(date("Y-m-d", $alert['start']));
                        $aEndDate = Carbon::parse(date("Y-m-d", $alert['end']));
                        $totalDays = ($aEndDate->diffInDays($aStartDate)) + 2;
                        $doExist = OpenWeatherMapAlert::where('open_weather_map_city_id', $city->id)->where('event', $alert['event'])->where('alert_date', $aStartDate)->count() > 0;
                        if (!$doExist) {
                            for ($i = 0; $i < $totalDays; $i++) {
                                $oWMAlert = new OpenWeatherMapAlert;
                                $oWMAlert->sender_name = $alert['sender_name'];
                                $oWMAlert->event = $alert['event'];
                                $oWMAlert->description = $alert['description'];
                                // Creating a copy of $aStartDate and adding loop count variable in days
                                $t = Carbon::parse($aStartDate);
                                $oWMAlert->alert_date = $t->addDays($i);
                                $oWMAlert->open_weather_map_city_id = $city->id;
                                $oWMAlert->save();
                            }
                        }
                    }
                }
            }else{
                print "\n" . $OCAResp['message'] . ".\n";
            }
        }

        print count($enabledCities) . " cities processed.\n";
        print $totalCitiesWithAlertsCount . " cities with alerts.\n";
        print $totalAlertsCount . " total alerts.\n";

        return 0;
    }
}
