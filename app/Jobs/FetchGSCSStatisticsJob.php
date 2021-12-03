<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\GoogleSearchConsoleSite;
use App\Models\GoogleSearchConsoleStatistics;
use App\Services\GoogleSearchConsoleService;
use Illuminate\Support\Carbon;

class FetchGSCSStatisticsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $googleSearchConsoleSite, $startDate, $endDate;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(GoogleSearchConsoleSite $googleSearchConsoleSite, $startDate, $endDate)
    {
        $this->googleSearchConsoleSite = $googleSearchConsoleSite;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function uniqueId()
    {
        return $this->googleSearchConsoleSite->id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $gSCS = new GoogleSearchConsoleService;

        print ("Fetching satistics for " . $this->googleSearchConsoleSite->site_url . " site with permission level " . $this->googleSearchConsoleSite->permission_level . " under account " . $this->googleSearchConsoleSite->googleAccount->account_id) . "\n";
        $dataRows = $gSCS->getGSCStatistics($this->googleSearchConsoleSite->googleAccount, $this->googleSearchConsoleSite, $this->startDate, $this->endDate);
        if ($dataRows !== false) {
            print (count($dataRows) . " rows fetched.") . "\n";
            GoogleSearchConsoleStatistics::where('google_search_console_site_id', $this->googleSearchConsoleSite->id)->whereBetween('statistics_date', [$this->startDate, $this->endDate])->delete();
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

                $row['google_search_console_site_id'] = $this->googleSearchConsoleSite->id;
                $row['google_account_id'] = $this->googleSearchConsoleSite->googleAccount->id;
                $row['user_id'] = $this->googleSearchConsoleSite->user_id;
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

        $dataRows = $gSCS->getGSCSearchAppearance($this->googleSearchConsoleSite->googleAccount, $this->googleSearchConsoleSite, $this->endDate);
        if ($dataRows !== false) {
            print (count($dataRows) . " rows fetched.") . "\n";
            foreach ($dataRows as  $dataRow) {
                $gSCStatistics = new GoogleSearchConsoleStatistics;
                $gSCStatistics->statistics_date = $this->startDate;
                $gSCStatistics->search_appearance = $dataRow['values'][0];

                $gSCStatistics->clicks_count = $dataRow['clicks'];
                $gSCStatistics->impressions_count = $dataRow['impressions'];
                $gSCStatistics->ctr_count = $dataRow['ctr'];
                $gSCStatistics->position_rank = $dataRow['position'];

                $gSCStatistics->google_search_console_site_id = $this->googleSearchConsoleSite->id;
                $gSCStatistics->google_account_id = $this->googleSearchConsoleSite->googleAccount->id;
                $gSCStatistics->save();
            }
        }
    }
}
