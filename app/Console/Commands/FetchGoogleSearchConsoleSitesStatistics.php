<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GoogleSearchConsoleSite;
use App\Models\GoogleSearchConsoleStatistics;
use App\Services\GoogleSearchConsoleService;
use Carbon\Carbon;

class FetchGoogleSearchConsoleSitesStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-google-search-console-sites-statistics {--FP|from-past}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will fetch yesterday\'s statistics of all saved google search console properties.';

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
        $gSCS = new GoogleSearchConsoleService;
        if ($this->option('from-past')) {
            $startDate = '2021-01-01';
            $endDate = Carbon::yesterday()->format('Y-m-d');
        } else {
            $startDate = $endDate = Carbon::yesterday()->format('Y-m-d');
        }

        $googleSearchConsoleSites = GoogleSearchConsoleSite::with('googleAccount')->get();
        foreach ($googleSearchConsoleSites as $googleSearchConsoleSite) {
            $this->info("Fetching satistics for $googleSearchConsoleSite->site_url site with permission level $googleSearchConsoleSite->permission_level under account " . $googleSearchConsoleSite->googleAccount->account_id);
            $dataRows = $gSCS->getGSCStatistics($googleSearchConsoleSite->googleAccount, $googleSearchConsoleSite, $startDate, $endDate);
            if ($dataRows !== false) {
                $this->info(count($dataRows) . " rows fetched.");
                GoogleSearchConsoleStatistics::where('google_search_console_site_id', $googleSearchConsoleSite->id)->whereBetween('statistics_date', [$startDate, $endDate])->delete();
                $rows = [];
                foreach ($dataRows as  $dataRow) {
                    $row = [];
                    $row['statistics_date'] = $dataRow['values'][4];
                    $row['query'] = $dataRow['values'][0];
                    $row['page'] = $dataRow['values'][1];
                    $row['country'] = $dataRow['values'][2];
                    $row['device'] = $dataRow['values'][3];

                    $row['clicks_count'] = $dataRow['clicks'];
                    $row['impressions_count'] = $dataRow['impressions'];
                    $row['ctr_count'] = $dataRow['ctr'];
                    $row['position_rank'] = $dataRow['position'];

                    $row['google_search_console_site_id'] = $googleSearchConsoleSite->id;
                    $row['google_account_id'] = $googleSearchConsoleSite->googleAccount->id;
                    $row['user_id'] = $googleSearchConsoleSite->user_id;
                    $rows[] = $row;

                    if (count($rows) > 5000) {
                        // formula for ^ number is max no. of placeholders in mysql (65535) / no. of columns you have in insert statement (12)
                        // I obviously rounded it to something human readable
                        GoogleSearchConsoleStatistics::insert($rows);
                        $rows = [];
                    }
                }
                if (count($rows)) {
                    GoogleSearchConsoleStatistics::insert($rows);
                }
            }

            $dataRows = $gSCS->getGSCSearchAppearance($googleSearchConsoleSite->googleAccount, $googleSearchConsoleSite, $endDate);
            if ($dataRows !== false) {
                $this->info(count($dataRows) . " rows fetched.");
                foreach ($dataRows as  $dataRow) {
                    $gSCStatistics = new GoogleSearchConsoleStatistics;
                    $gSCStatistics->statistics_date = $startDate;
                    $gSCStatistics->search_appearance = $dataRow['values'][0];

                    $gSCStatistics->clicks_count = $dataRow['clicks'];
                    $gSCStatistics->impressions_count = $dataRow['impressions'];
                    $gSCStatistics->ctr_count = $dataRow['ctr'];
                    $gSCStatistics->position_rank = $dataRow['position'];

                    $gSCStatistics->google_search_console_site_id = $googleSearchConsoleSite->id;
                    $gSCStatistics->google_account_id = $googleSearchConsoleSite->googleAccount->id;
                    $gSCStatistics->save();
                }
            }
        }

        return 0;
    }
}
