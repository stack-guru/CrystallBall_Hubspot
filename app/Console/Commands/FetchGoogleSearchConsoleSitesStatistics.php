<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GoogleSearchConsoleSite;
use App\Jobs\FetchGSCSStatisticsJob;
use Illuminate\Support\Carbon;

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
    protected $description = 'Fetch yesterday\'s statistics of all saved google search console properties.';

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
        if ($this->option('from-past')) {
            $startDate = '2021-01-01';
        } else {
            $startDate = Carbon::now()->subDays(3)->format('Y-m-d');
        }
        $endDate = Carbon::now()->format('Y-m-d');

        $googleSearchConsoleSites = GoogleSearchConsoleSite::with('googleAccount')->get();
        $this->info(count($googleSearchConsoleSites) . " search console sites fetched for processing.");
        foreach ($googleSearchConsoleSites as $googleSearchConsoleSite) {
            FetchGSCSStatisticsJob::dispatch($googleSearchConsoleSite, $startDate, $endDate);
        }
        $this->info("Job to fetch statistics queued.");

        return 0;
    }
}
