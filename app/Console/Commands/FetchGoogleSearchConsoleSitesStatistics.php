<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GoogleSearchConsoleSite;
use App\Models\GoogleSearchConsoleStatistics;
use App\Services\GoogleSearchConsoleService;
use App\Jobs\FetchGSCSStatisticsJob;
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
        if ($this->option('from-past')) {
            $startDate = '2021-01-01';
            $endDate = Carbon::yesterday()->format('Y-m-d');
        } else {
            $startDate = $endDate = Carbon::yesterday()->format('Y-m-d');
        }

        $googleSearchConsoleSites = GoogleSearchConsoleSite::with('googleAccount')->get();
        foreach ($googleSearchConsoleSites as $googleSearchConsoleSite) {
            FetchGSCSStatisticsJob::dispatch($googleSearchConsoleSite, $startDate, $endDate);
        }

        return 0;
    }
}
