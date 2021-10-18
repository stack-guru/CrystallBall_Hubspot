<?php

namespace App\Console\Commands;

use App\Services\GoogleAnalyticsService;
use Illuminate\Console\Command;
use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAnalyticsMetricDimension;
use Carbon\Carbon;

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
        $gAS = new GoogleAnalyticsService;
        if ($this->option('from-past')) {
            // Don't reduce startDate any further as it will result in an error. "Date <your reduced date> precedes Google Analytics launch date 2005-01-01"
            $startDate = '2005-01-01';
            $endDate = Carbon::yesterday()->format('Y-m-d');
        } else {
            $startDate = $endDate = Carbon::yesterday()->format('Y-m-d');
        }

        $googleAnalyticsProperties = GoogleAnalyticsProperty::with('googleAccount')->get();
        foreach ($googleAnalyticsProperties as $googleAnalyticsProperty) {
            $this->info("Fetching metrics and dimensions for $googleAnalyticsProperty->internal_property_id property of kind $googleAnalyticsProperty->kind under account " . $googleAnalyticsProperty->googleAccount->account_id);
            $dataRows = $gAS->getMetricsAndDimensions($googleAnalyticsProperty->googleAccount, $googleAnalyticsProperty, $startDate, $endDate);
            if ($dataRows !== false) {
                $this->info(count($dataRows) . " rows fetched.");
                GoogleAnalyticsMetricDimension::where('ga_property_id', $googleAnalyticsProperty->id)->whereBetween('statistics_date', [$startDate, $endDate])->delete();
                foreach ($dataRows as  $dataRow) {
                    $gAMD = new GoogleAnalyticsMetricDimension;
                    $gAMD->statistics_date = $dataRow['dimensions'][0];
                    $gAMD->source_name = $dataRow['dimensions'][1];
                    $gAMD->medium_name = $dataRow['dimensions'][2];
                    $gAMD->device_category = $dataRow['dimensions'][3];
                    $gAMD->users_count = $dataRow['metrics'][0];
                    $gAMD->sessions_count = $dataRow['metrics'][1];
                    $gAMD->events_count = $dataRow['metrics'][2];
                    $gAMD->conversions_count = array_key_exists('3', $dataRow['metrics']) ? $dataRow['metrics'][3] : 0;
                    $gAMD->ga_property_id = $googleAnalyticsProperty->id;
                    $gAMD->ga_account_id = $googleAnalyticsProperty->google_analytics_account_id;
                    $gAMD->google_account_id = $googleAnalyticsProperty->googleAccount->id;
                    $gAMD->save();
                }
            }
        }

        return 0;
    }
}
