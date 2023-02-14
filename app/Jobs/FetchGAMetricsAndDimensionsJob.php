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
use Illuminate\Support\Carbon;

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

        $dataRows = $gAS->getMetricsAndDimensions($this->googleAnalyticsProperty->googleAccount, $this->googleAnalyticsProperty, $this->startDate, $this->endDate);
        if ($dataRows !== false) {

            // As we are dealing with table with +10000000 records, we need to delete data in chunks on 5000
            do {
                $deleteCount = GoogleAnalyticsMetricDimension::where('ga_property_id', $this->googleAnalyticsProperty->id)
                    ->whereBetween('statistics_date', [$this->startDate, $this->endDate])
                    ->limit(5000)
                    ->delete();
            } while ($deleteCount > 0);

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
            $this->googleAnalyticsProperty->was_last_data_fetching_successful = true;
        } else {
            $this->googleAnalyticsProperty->was_last_data_fetching_successful = false;
        }
        $this->googleAnalyticsProperty->save();
    }
}
