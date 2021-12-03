<?php

namespace App\Console\Commands;

use App\Models\AdwordsKeywordPerformance;
use App\Models\GoogleAccount;
use App\Services\GoogleAdwordsService;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class FetchAdwordsKeywordsClicks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-adwords-keywords-clicks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will fetch Google AdWords Keywords along with their clicks to show annotations if there is any drastic change.';

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
        $fetchingDate = Carbon::now()->addDays(-1);

        $googleAdwordsService = new GoogleAdwordsService;
        $googleAccounts = GoogleAccount::whereNotNull('adwords_client_customer_id')->get();

        $totalAccounts = count($googleAccounts);
        $totalKeywords = 0;
        foreach ($googleAccounts as $googleAccount) {
            $keywords = $googleAdwordsService->getAccountKeywords($googleAccount);
            if ($keywords) {
                $totalKeywords += count($keywords);
                AdwordsKeywordPerformance::insert(array_map(function ($arr) use ($googleAccount, $fetchingDate) {
                    return [
                        'fetched_at' => $fetchingDate,

                        'campaign_id' => $arr['campaignID'],
                        'ad_group_id' => $arr['adGroupID'],
                        'keyword_id' => $arr['keywordID'],

                        'campaign_name' => $arr['campaign'],
                        'ad_group_name' => $arr['adGroup'],
                        'keyword_name' => $arr['labels'],

                        'clicks' => $arr['clicks'],

                        'google_account_id' => $googleAccount->id,
                        'user_id' => $googleAccount->user_id,
                    ];
                }, $keywords));
            }
        }

        print $totalAccounts . " google accounts processed.\n";
        print $totalKeywords . " keywords fetched.\n";
        return 0;
    }
}
