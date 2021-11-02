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
            // Don't reduce startDate below 2005-01-01 as it will result in an error. "Date <your reduced date> precedes Google Analytics launch date 2005-01-01"
            $startDate = '2021-01-01';
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
                $rows = [];
                foreach ($dataRows as  $dataRow) {
                    $row = [];
                    $row['statistics_date'] = $dataRow['dimensions'][0];
                    $row['source_name'] = $dataRow['dimensions'][1];
                    $row['medium_name'] = $dataRow['dimensions'][2];
                    $row['device_category'] = $dataRow['dimensions'][3];
                    $row['users_count'] = $dataRow['metrics'][0];
                    $row['sessions_count'] = $dataRow['metrics'][1];
                    $row['events_count'] = $dataRow['metrics'][2];
                    $row['conversions_count'] = array_key_exists('3', $dataRow['metrics']) ? $dataRow['metrics'][3] : 0;
                    $row['ga_property_id'] = $googleAnalyticsProperty->id;
                    $row['ga_account_id'] = $googleAnalyticsProperty->google_analytics_account_id;
                    $row['google_account_id'] = $googleAnalyticsProperty->googleAccount->id;
                    $row['user_id'] = $googleAnalyticsProperty->user_id;
                    $rows[] = $row;

                    if (count($rows) > 5000) {
                        // formula for ^ number is max no. of placeholders in mysql (65535) / no. of columns you have in insert statement (12)
                        // I obviously rounded it to something human readable
                        GoogleAnalyticsMetricDimension::insert($rows);
                        $rows = [];
                    }
                }
                if (count($rows)) {
                    GoogleAnalyticsMetricDimension::insert($rows);
                }
            }
        }

        return 0;
    }
}
