<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChecklistItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('checklist_items')->delete();
        DB::table('checklist_items')->insert([
            ['name' => 'IMP_ANN_CSV', 'label' => 'Import Annotations from CSV', 'description' => null, 'url' => '/annotation/upload', 'sort_rank' => 10],

            ['name' => 'AUTO_WEB_MON', 'label' => 'Automate Web Monitoring', 'description' => null, 'url' => '/data-source', 'sort_rank' => 20],
            ['name' => 'AUTO_GOOG_ALERT', 'label' => 'Automate News Alert', 'description' => null, 'url' => '/data-source', 'sort_rank' => 30],
            ['name' => 'AUTO_GOOG_UPD', 'label' => 'Automate Google Updates', 'description' => null, 'url' => '/data-source', 'sort_rank' => 40],
            ['name' => 'AUTO_RET_MKT_DTE', 'label' => 'Automate Retail Marketing Dates', 'description' => null, 'url' => '/data-source', 'sort_rank' => 50],
            ['name' => 'AUTO_HOLIDAYS', 'label' => 'Automate Holidays', 'description' => null, 'url' => '/data-source', 'sort_rank' => 60],
            ['name' => 'AUTO_WEA_ALERTS', 'label' => 'Automate Weather Alerts', 'description' => null, 'url' => '/data-source', 'sort_rank' => 70],
            ['name' => 'AUTO_WP_UPDATES', 'label' => 'Automate Wordpress Updates', 'description' => null, 'url' => '/data-source', 'sort_rank' => 80],

            ['name' => 'CONN_ADWORDS', 'label' => 'Connect with AdWords', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-google-ads-campaign-with-google-analytics-annotation-creation-trigger', 'sort_rank' => 90],
            ['name' => 'CONN_MAILCHIMP', 'label' => 'Connect with MailChimp', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-mailchimp-with-ga4-annotations-new-campaign-creation-trigger', 'sort_rank' => 100],
            ['name' => 'CONN_SHOPIFY', 'label' => 'Connect with Shopify', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-shopify-with-google-analytics-annotation-creation-trigger', 'sort_rank' => 110],
            ['name' => 'CONN_SLACK', 'label' => 'Connect with Slack', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-slack-with-google-analytics-4-annotations-creation-trigger', 'sort_rank' => 120],
            ['name' => 'CONN_ASANA', 'label' => 'Connect with Asana', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-asana-with-ga4-annotations-creation-trigger', 'sort_rank' => 130],
            ['name' => 'CONN_JIRA', 'label' => 'Connect with Jira', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-jira-with-ga4-annotations-creation-trigger', 'sort_rank' => 140],
            ['name' => 'CONN_TRELLO', 'label' => 'Connect with Trello', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-trello-with-ga4-annotations-creation-trigger', 'sort_rank' => 150],
            ['name' => 'CONN_GITHUB', 'label' => 'Connect with Github', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-github-google-analytics-annotation-creation-trigger', 'sort_rank' => 160],
            ['name' => 'CONN_BITBUCKET', 'label' => 'Connect with Bitbucket', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-bitbucket-with-ga4-annotations-creation-trigger', 'sort_rank' => 170],
            ['name' => 'CONN_GOOG_SHTS', 'label' => 'Connect with Google Sheets', 'description' => null, 'url' => 'https://www.gaannotations.com/integrate-with-google-sheets', 'sort_rank' => 180],
            ['name' => 'CONN_A_TOOL', 'label' => 'Connect a tool', 'description' => null, 'url' => '/api-key', 'sort_rank' => 200],

            ['name' => 'CONN_DATA_STUDIO', 'label' => 'Connect with Data Studio', 'description' => null, 'url' => '/analytics-and-business-intelligence', 'sort_rank' => 190],
            ['name' => 'CONN_GOOG_ANALYTICS', 'label' => 'Connect with Google Analytics', 'description' => null, 'url' => '/analytics-and-business-intelligence', 'sort_rank' => 200],
            ['name' => 'CONN_MICRO_POWER_BI', 'label' => 'Connect with Microsoft Power BI', 'description' => null, 'url' => '/analytics-and-business-intelligence', 'sort_rank' => 210],
            ['name' => 'CONN_CHR_EXT', 'label' => 'Install Chrome Extension', 'description' => null, 'url' => 'https://chrome.google.com/webstore/detail/automated-google-analytic/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en', 'sort_rank' => 220],
            ['name' => 'CONN_ANALYTICS_DATA', 'label' => 'Connect your Analytics data', 'description' => null, 'url' => '/dashboard/analytics', 'sort_rank' => 225],

            ['name' => 'INV_TEAM', 'label' => 'Invite your Team', 'description' => null, 'url' => '/settings/user', 'sort_rank' => 230],
        ]);
    }
}
