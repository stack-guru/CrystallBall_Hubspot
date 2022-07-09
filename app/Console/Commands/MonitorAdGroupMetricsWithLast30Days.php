<?php

namespace App\Console\Commands;

use App\Services\GoogleAdsService;
use Illuminate\Console\Command;
use App\Models\GoogleAccount;
use App\Models\GoogleAdsAnnotation;
use Illuminate\Support\Carbon;

class MonitorAdGroupMetricsWithLast30Days extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:monitor-ad-group-metrics-with-last-30-days';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compare yesterday data to the avg data of the last 30 days per ad group';

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
        $thirtyDaysOldDate = Carbon::now()->subDays(30);;
        $fetchingDate = Carbon::now()->subDay();

        $googleAdsService = new GoogleAdsService;
        $googleAccounts = GoogleAccount::whereNotNull('adwords_client_customer_id')->get();

        foreach ($googleAccounts as $googleAccount) {
            $campaigns = array_map(function ($a) {
                return [$a['campaign']['id'] => $a['campaign']];
            }, $googleAdsService->getCampaigns($googleAccount));

            $oneDayAdGroupMetrics = array_map(function ($a) {
                if (key_exists('metrics', $a)) return array_merge($a['adGroup'], $a['metrics']);
                return $a['adGroup'];
            }, $googleAdsService->getAdGroupOneDayMetrics($googleAccount, $fetchingDate));
            $oneDayAdGroupMetrics = array_combine(array_column($oneDayAdGroupMetrics, 'id'), $oneDayAdGroupMetrics);

            $thirtyDaysAdGroupMetrics = array_map(function ($a) {
                if (key_exists('metrics', $a)) return array_merge($a['adGroup'], $a['metrics']);
                return $a['adGroup'];
            }, $googleAdsService->getAdGroupBetweenDaysAVGMetrics($googleAccount, $thirtyDaysOldDate, $fetchingDate));
            $thirtyDaysAdGroupMetrics = array_combine(array_column($thirtyDaysAdGroupMetrics, 'id'), $thirtyDaysAdGroupMetrics);

            foreach ($oneDayAdGroupMetrics as $adGroup) {
                if (key_exists($adGroup['id'], $thirtyDaysAdGroupMetrics)) {
                    // Cost Per Conversion annotation
                    if (key_exists('costPerConversion', $adGroup)) {
                        $difference = $adGroup['costPerConversion'] - $thirtyDaysAdGroupMetrics[$adGroup['id']]['averageCpc'];
                        $differencePercent = abs((($difference / $thirtyDaysAdGroupMetrics[$adGroup['id']]['averageCpc']) * 100));
                        if ($differencePercent > 80) {
                            $googleAdsAnnotation = new GoogleAdsAnnotation;

                            $googleAdsAnnotation->user_id = $googleAccount->user_id;
                            $googleAdsAnnotation->google_account_id = $googleAccount->id;
                            $googleAdsAnnotation->title = '';
                            $googleAdsAnnotation->event_name = '';
                            $googleAdsAnnotation->category = '';
                            $googleAdsAnnotation->url = '';
                            $googleAdsAnnotation->description = "Anomally detected $differencePercent%. From AVG(" . $thirtyDaysAdGroupMetrics[$adGroup['id']]['averageCpc'] . ") to " . $adGroup['costPerConversion'];
                            $googleAdsAnnotation->detected_at = $fetchingDate;

                            $googleAdsAnnotation->save();

                            $this->info("Anomally detected $differencePercent%. From AVG(" . $thirtyDaysAdGroupMetrics[$adGroup['id']]['averageCpc'] . ") to " . $adGroup['costPerConversion']);
                        }
                    }
                }
            }
        }

        $this->info(count($googleAccounts) . " google accounts processed.");

        return 0;
    }
}
