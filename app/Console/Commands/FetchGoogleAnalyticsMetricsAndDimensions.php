<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Support\Carbon;
use App\Jobs\FetchGAMetricsAndDimensionsJob;

class FetchGoogleAnalyticsMetricsAndDimensions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-google-analytics-metrics-and-dimensions {--FP|from-past}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will fetch yesterday\'s metrics and dimensions of all saved google properties.';

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
            // Don't reduce startDate below 2005-01-01 as it will result in an error.
            // "Date <your reduced date> precedes Google Analytics launch date 2005-01-01"
            $startDate = '2021-01-01';
        } else {
            $startDate = Carbon::now()->subDays(3)->format('Y-m-d');
        }
        $endDate = Carbon::now()->format('Y-m-d');

        $googleAnalyticsProperties = GoogleAnalyticsProperty::with('googleAccount')->get();
        foreach ($googleAnalyticsProperties as $googleAnalyticsProperty) {
            FetchGAMetricsAndDimensionsJob::dispatch($googleAnalyticsProperty, $startDate, $endDate);
        }

        return 0;
    }
}
