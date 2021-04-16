<?php

namespace App\Console\Commands;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsProperty;
use App\Services\GoogleAnalyticsService;
use Illuminate\Console\Command;

class FetchAllAnalyticsProperties extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-all-analytics-properties';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch all google analytics properties using connected google accounts and google analytics accounts.';

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

        $googleAccounts = GoogleAccount::with('googleAnalyticsAccounts')->get();
        foreach ($googleAccounts as $googleAccount) {
            $googleAnalyticsAccounts = $googleAccount->googleAnalyticsAccounts;
            foreach ($googleAnalyticsAccounts as $googleAnalyticsAccount) {
                $googleAnalyticsProperties = $gAS->getAccountProperties($googleAccount, $googleAnalyticsAccount);
                $savedGoogleAnalyticPropertyIds = GoogleAnalyticsProperty::select('property_id')->where('user_id', $googleAnalyticsAccount->user_id)->orderBy('property_id')->get()->pluck('property_id')->toArray();

                foreach ($googleAnalyticsProperties as $googleAnalyticsProperty) {
                    if (!in_array($googleAnalyticsProperty['id'], $savedGoogleAnalyticPropertyIds)) {
                        $nGAP = new GoogleAnalyticsProperty;
                        $nGAP->property_id = $googleAnalyticsProperty['id'];
                        $nGAP->kind = $googleAnalyticsProperty['kind'];
                        $nGAP->self_link = $googleAnalyticsProperty['selfLink'];
                        $nGAP->account_id = $googleAnalyticsProperty['accountId'];
                        $nGAP->internal_property_id = $googleAnalyticsProperty['internalWebPropertyId'];
                        $nGAP->name = $googleAnalyticsProperty['name'];
                        $nGAP->website_url = $googleAnalyticsProperty['websiteUrl'];
                        $nGAP->level = $googleAnalyticsProperty['level'];
                        $nGAP->profile_count = $googleAnalyticsProperty['profileCount'];
                        $nGAP->industry_vertical = $googleAnalyticsProperty['industryVertical'];
                        $nGAP->default_profile_id = $googleAnalyticsProperty['defaultProfileId'];
                        $nGAP->data_retention_ttl = $googleAnalyticsProperty['dataRetentionTtl'];
                        $nGAP->ga_created = new \DateTime($googleAnalyticsProperty['created']);
                        $nGAP->ga_updated = new \DateTime($googleAnalyticsProperty['updated']);
                        $nGAP->parent_type = $googleAnalyticsProperty['parentLink']['type'];
                        $nGAP->parent_link = $googleAnalyticsProperty['parentLink']['href'];
                        $nGAP->child_type = $googleAnalyticsProperty['childLink']['type'];
                        $nGAP->child_link = $googleAnalyticsProperty['childLink']['href'];
                        $nGAP->permissions = json_encode($googleAnalyticsProperty['permissions']);
                        $nGAP->google_analytics_account_id = $googleAnalyticsAccount->id;
                        $nGAP->google_account_id = $googleAccount->id;
                        $nGAP->user_id = $googleAccount->user_id;
                        $nGAP->save();
                    }
                }
            }
        }
    }
}
