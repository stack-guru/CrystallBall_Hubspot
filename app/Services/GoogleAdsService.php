<?php

namespace App\Services;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Http;
use App\Services\GoogleAPIService;
use Illuminate\Support\Facades\Log;

class GoogleAdsService  extends GoogleAPIService
{

    protected $adwordsDeveloperToken;
    protected $loginManagerCustomerId;

    public function __construct()
    {
        parent::__construct();
        $this->adwordsDeveloperToken = config('services.google.adwords.developer_token');
        $this->ManagerAccountCustomerId =  str_replace("-", "", config('services.google.adwords.manager_account.customer_id'));
    }

    public function getAccessibleCustomers(GoogleAccount $googleAccount, $repeatCall = false)
    {
        $url = "https://googleads.googleapis.com/v10/customers:listAccessibleCustomers";

        $response = Http::withHeaders([
            'developer-token' => $this->adwordsDeveloperToken,
            // 'login-customer-id' => $this->ManagerAccountCustomerId
        ])->withToken($googleAccount->token)->get($url);

        if ($response->status() == 400 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gAK = $this->getAccessibleCustomers($googleAccount, true);
                // On success it returns google analytics accounts else false
                if ($gAK !== false) {
                    return $gAK;
                } else {
                    return false;
                }
            }
        } else if ($response->status() == 401 && $repeatCall) {
            return false;
        }

        $respJson = $response->json();
        if (!array_key_exists('resourceNames', $respJson)) return [];

        return array_map(function ($a) {
            $accountId = substr($a, 10);
            return substr($accountId, 0, 3) . '-' . substr($accountId, 3, 3) . '-' . substr($accountId, 6, 4);
        }, $respJson['resourceNames']);
    }

    public function getCampaigns(GoogleAccount $googleAccount, $repeatCall = false)
    {
        $url = "https://googleads.googleapis.com/v10/customers/" . str_replace("-", "", $googleAccount->adwords_client_customer_id) . "/googleAds:search";

        $response = Http::withHeaders([
            'developer-token' => $this->adwordsDeveloperToken,
            'login-customer-id' => $this->ManagerAccountCustomerId
        ])->withToken($googleAccount->token)->asForm()->post($url, [
            'pageSize' => 10,
            // https://developers.google.com/google-ads/api/fields/v10/campaign
            // https://developers.google.com/google-ads/api/fields/v10/campaign_query_builder
            'query' => "SELECT campaign.id,
            campaign.end_date,
            campaign.name,
            campaign.resource_name,
            campaign.serving_status,
            campaign.start_date,
            campaign.status,
            campaign.target_cpm,
            metrics.average_cost,
            metrics.average_cpc,
            metrics.average_cpe,
            metrics.average_cpm,
            metrics.average_cpv,
            metrics.average_page_views,
            metrics.bounce_rate,
            metrics.clicks,
            metrics.conversions,
            metrics.ctr 
          FROM campaign 
          WHERE 
            campaign.status != 'REMOVED'",
        ]);
        Log::channel('google')->error("Adwords API Response: ", ['response' => $response->json()]);
    }

    public function getAdGroups(GoogleAccount $googleAccount, $repeatCall = false)
    {
        $url = "https://googleads.googleapis.com/v10/customers/" . str_replace("-", "", $googleAccount->adwords_client_customer_id) . "/googleAds:search";

        $response = Http::withHeaders([
            'developer-token' => $this->adwordsDeveloperToken,
            'login-customer-id' => $this->ManagerAccountCustomerId
        ])->withToken($googleAccount->token)->asForm()->post($url, [
            'pageSize' => 10,
            // https://developers.google.com/google-ads/api/fields/v10/ad_group
            // https://developers.google.com/google-ads/api/fields/v10/ad_group_query_builder
            'query' => "SELECT ad_group.id,
            ad_group.campaign,
            ad_group.name,
            ad_group.resource_name,
            ad_group.status,
            ad_group.type,
            ad_group.target_cpa_micros,
            ad_group.target_cpm_micros,
            ad_group.target_roas,
            metrics.absolute_top_impression_percentage,
            metrics.active_view_cpm,
            metrics.active_view_ctr,
            metrics.average_cost,
            metrics.average_cpc,
            metrics.average_cpe,
            metrics.average_cpm,
            metrics.average_cpv,
            metrics.average_page_views,
            metrics.bounce_rate,
            metrics.clicks,
            metrics.ctr,
            campaign.name
          FROM ad_group 
          WHERE 
            ad_group.status != 'REMOVED' ",
        ]);
        Log::channel('google')->error("Adwords API Response: ", ['response' => $response->json()]);
    }

    public function getAdGroupOneDayMetrics(GoogleAccount $googleAccount, $selectedDate, $repeatCall = false)
    {
        $url = "https://googleads.googleapis.com/v10/customers/" . str_replace("-", "", $googleAccount->adwords_client_customer_id) . "/googleAds:search";

        $response = Http::withHeaders([
            'developer-token' => $this->adwordsDeveloperToken,
            'login-customer-id' => $this->ManagerAccountCustomerId
        ])->withToken($googleAccount->token)->asForm()->post($url, [
            'pageSize' => 10,
            // https://developers.google.com/google-ads/api/fields/v10/ad_group
            // https://developers.google.com/google-ads/api/fields/v10/ad_group_query_builder
            'query' => "SELECT 
            metrics.impressions,
            metrics.clicks,
            metrics.cost_per_all_conversions,
            metrics.cost_per_conversion,
            metrics.all_conversions,
            metrics.conversions
          FROM ad_group 
          WHERE 
            ad_group.status != 'REMOVED' 
            AND segments.date = '" . $selectedDate->format('Y-m-d') . "'",
        ]);
        Log::channel('google')->error("Adwords API Response: ", ['response' => $response->json()]);
    }

    public function getAdGroupBetweenDaysMetrics(GoogleAccount $googleAccount, $startDate, $endDate, $repeatCall = false)
    {
        $url = "https://googleads.googleapis.com/v10/customers/" . str_replace("-", "", $googleAccount->adwords_client_customer_id) . "/googleAds:search";

        $response = Http::withHeaders([
            'developer-token' => $this->adwordsDeveloperToken,
            'login-customer-id' => $this->ManagerAccountCustomerId
        ])->withToken($googleAccount->token)->asForm()->post($url, [
            'pageSize' => 10,
            // https://developers.google.com/google-ads/api/fields/v10/ad_group
            // https://developers.google.com/google-ads/api/fields/v10/ad_group_query_builder
            'query' => "SELECT 
            metrics.average_cost,
            metrics.average_cpc,
            metrics.average_cpe,
            metrics.average_cpm,
            metrics.average_cpv,
            metrics.average_page_views,
            metrics.average_time_on_site 
          FROM ad_group 
          WHERE 
            ad_group.status != 'REMOVED' 
            AND segments.date BETWEEN '" . $startDate->format('Y-m-d') . "' AND '" . $endDate->format('Y-m-d') . "'",
        ]);
        Log::channel('google')->error("Adwords API Response: ", ['response' => $response->json()]);
    }
}
