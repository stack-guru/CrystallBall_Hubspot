<?php

namespace App\Console\Commands;

use App\Models\UserDataSource;
use App\Models\WebMonitor;
use App\Services\SendGridService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendNewDataSourcesEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:send-new-data-sources-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gather user ids from user data sources table and iterate over them to add new data source options to mailing list.';

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
        $startDateTime = Carbon::now()->subHour(); //->addHours(11);
        $endDateTime = Carbon::now(); //->addHours(11);
        $sGS = new SendGridService;

        $neededDSCodes = ['holidays', 'google_alert_keywords', 'open_weather_map_cities'];

        $this->info("Finding users who have added user data sources between $startDateTime and $endDateTime.");
        $users = UserDataSource::select('user_id')
            ->whereBetween('created_at', [$startDateTime, $endDateTime])
            ->whereIn('ds_code', $neededDSCodes)
            ->with('user')
            ->distinct()
            ->orderBy('user_id')
            ->get();

        $this->info(count($users) . " users found.");

        $this->info("Iterating through users to gather data sources.");
        foreach ($users as $user) {
            $this->info("Processing user of id $user->user_id.");

            $userDataSources = UserDataSource::where('user_id', $user->user_id)
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->whereIn('ds_code', $neededDSCodes)
                ->orderBy('ds_code')
                ->with('openWeatherMapCity')
                ->get();

            $this->info(count($userDataSources) . " relevant data sources found.");

            $values = [];
            $dsCode = "";
            foreach ($userDataSources as $userDataSource) {

                if ($dsCode !== $userDataSource->ds_code) {
                    $this->addToRelevantList($sGS, $dsCode, $user->user, $values);

                    $values = [];
                    $dsCode = "";
                }

                // 'google_alert_keywords' |   'google_algorithm_update_dates' |
                // 'holidays' |   'open_weather_map_cities' |   'open_weather_map_events' |
                // 'wordpress_updates |

                switch ($userDataSource->ds_code) {
                    case 'google_alert_keywords':
                        $values[] = $userDataSource->value;
                        break;
                    case 'holidays':
                        $values[] = $userDataSource->country_name;
                        break;
                    case 'open_weather_map_cities':
                        $values[] = $userDataSource->openWeatherMapCity->name;
                        break;
                }

                $dsCode = $userDataSource->ds_code;
            }
            $this->addToRelevantList($sGS, $dsCode, $user->user, $values);
        }
        /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////
        $this->info("Finding users who have added web monitors between $startDateTime and $endDateTime.");
        $users = WebMonitor::select('user_id')
            ->whereBetween('created_at', [$startDateTime, $endDateTime])
            ->with('user')
            ->distinct()
            ->orderBy('user_id')
            ->get();

        $this->info(count($users) . " users found.");

        $this->info("Iterating through users to gather web monitors.");
        foreach ($users as $user) {
            $this->info("Processing user of id $user->user_id.");

            $userWebMonitorsURL = WebMonitor::where('user_id', $user->user_id)
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->get(["url"])
                ->pluck("url")
                ->toArray();

            $this->info(count($userWebMonitorsURL) . " web monitors found.");

            $values = $userWebMonitorsURL;

            $this->addToRelevantList($sGS, "web_monitors", $user->user, $values);
        }
    }

    private function addToRelevantList($sGS, $dsCode, $user, $values)
    {
        switch ($dsCode) {
            case 'google_alert_keywords':
                $sGS->addUserToContactList($user, "News Alerts for [keywords] Activated", ['w11_T' => implode(" ", $values)]);
                break;
            case 'holidays':
                $sGS->addUserToContactList($user, "Holidays for [Country_name] Activated", ['w10_T' => implode(" ", $values)]);
                break;
            case 'open_weather_map_cities':
                $sGS->addUserToContactList($user, "Weather for [cities] Activated", ['w12_T' => implode(" ", $values)]);
                break;
            case 'web_monitors':
                $sGS->addUserToContactList($user, "Website Monitoring Activated");
                break;
        }
    }
}
