<?php

namespace App\Services;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Http;
use App\Services\GoogleAPIService;

class GoogleAdwordsService  extends GoogleAPIService
{

    public function getAccountKeywords(GoogleAccount $googleAccount, $repeatCall = false)
    {
        $url = "https://adwords.google.com/api/adwords/reportdownload/v201809";

        $response = Http::withHeaders([
            'clientCustomerId' => $googleAccount->adwords_client_customer_id,
            'adwordsDeveloperToken' => $this->adwordsDeveloperToken,
        ])->withToken($googleAccount->token)->asForm()->post($url, [
            '__rdquery' => 'SELECT Id, AdGroupId, AdGroupName, Clicks, Labels, CampaignId, CampaignName FROM KEYWORDS_PERFORMANCE_REPORT',
            '__fmt' => 'XML',
        ]);

        if ($response->status() == 400 && !$repeatCall) {
            // This code block only checks if google accounts can be fetched after refreshing access token
            if ($this->refreshToken($googleAccount) == false) {
                return false;
            } else {
                $gAK = $this->getAccountKeywords($googleAccount, true);
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

        $simpleXML = simplexml_load_string($response->body());

        if (!$simpleXML->table->row->count()) {
            return false;
        }

        $keywords = [];
        foreach ($simpleXML->table->row as $row) {
            $arr = [];
            foreach ($row->attributes() as $key => $value) {
                $arr[$key] = $value->__toString();
            }
            array_push($keywords, $arr);
        }
        return $keywords;
    }
}
