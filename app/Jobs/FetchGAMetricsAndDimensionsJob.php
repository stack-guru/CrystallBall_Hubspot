<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\GoogleAnalyticsService;
use App\Models\GoogleAnalyticsProperty;
use App\Models\GoogleAnalyticsMetricDimension;
use Carbon\Carbon;

class FetchGAMetricsAndDimensionsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $googleAnalyticsProperty, $startDate, $endDate;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(GoogleAnalyticsProperty $googleAnalyticsProperty, $startDate, $endDate)
    {
        $this->googleAnalyticsProperty = $googleAnalyticsProperty;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function uniqueId()
    {
        return $this->googleAnalyticsProperty->id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $gAS = new GoogleAnalyticsService;

        print("Fetching metrics and dimensions for " . $this->googleAnalyticsProperty->internal_property_id . " property of kind " . $this->googleAnalyticsProperty->kind . " under account " . $this->googleAnalyticsProperty->googleAccount->account_id) . "\n";
        $dataRows = $gAS->getMetricsAndDimensions($this->googleAnalyticsProperty->googleAccount, $this->googleAnalyticsProperty, $this->startDate, $this->endDate);
        if ($dataRows !== false) {
            print(count($dataRows) . " rows fetched.") . "\n";
            GoogleAnalyticsMetricDimension::where('ga_property_id', $this->googleAnalyticsProperty->id)->whereBetween('statistics_date', [$this->startDate, $this->endDate])->delete();
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
                $row['ga_property_id'] = $this->googleAnalyticsProperty->id;
                $row['ga_account_id'] = $this->googleAnalyticsProperty->google_analytics_account_id;
                $row['google_account_id'] = $this->googleAnalyticsProperty->googleAccount->id;
                $row['user_id'] = $this->googleAnalyticsProperty->user_id;
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
}
