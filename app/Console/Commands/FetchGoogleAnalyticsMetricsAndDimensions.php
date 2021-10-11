<?php

namespace App\Console\Commands;

use App\Services\GoogleAnalyticsService;
use Illuminate\Console\Command;
use App\Models\GoogleAnalyticsProperty;
use Carbon\Carbon;

class FetchGoogleAnalyticsMetricsAndDimensions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-google-analytics-metrics-and-dimensions';

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
        $yesterdayDate = Carbon::yesterday()->format('Y-m-d');
        $googleAnalyticsProperties = GoogleAnalyticsProperty::with('googleAccount')->get();
        foreach ($googleAnalyticsProperties as $googleAnalyticsProperty) {
            $this->info("Fetching metrics and dimensions for $googleAnalyticsProperty->name($googleAnalyticsProperty->internal_property_id) under account " . $googleAnalyticsProperty->googleAccount->name . "(" . $googleAnalyticsProperty->googleAccount->account_id . ")");
            switch ($googleAnalyticsProperty->kind) {
                case 'analytics#webproperty':
                    $dataRows = $gAS->getUAMetricsAndDimensions($googleAnalyticsProperty->googleAccount, $googleAnalyticsProperty, $yesterdayDate);
                    break;

                case 'analytics#ga4property':
                    $dataRows = $gAS->getGA4MetricsAndDimensions($googleAnalyticsProperty->googleAccount, $googleAnalyticsProperty, $yesterdayDate);
                    break;
            }
            var_dump($dataRows);
        }

        return 0;
    }
}
