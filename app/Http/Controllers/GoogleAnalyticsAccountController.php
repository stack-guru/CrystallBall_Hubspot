<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use App\Models\GoogleAnalyticsProperty;
use App\Services\GoogleAnalyticsService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Jobs\FetchGAMetricsAndDimensionsJob;

class GoogleAnalyticsAccountController extends Controller
{
    public function index()
    {
        return ['google_analytics_accounts' => GoogleAnalyticsAccount::ofCurrentUser()->with('googleAccount')->orderBy('name')->get()];
    }

    public function fetch(GoogleAccount $googleAccount)
    {
        $user = Auth::user();
        if ($googleAccount->user_id !== $user->id) {
            abort(404, 'Unable to find Google Analytics account with the given id.');
        }

        $gAS = new GoogleAnalyticsService;
        $googleAnalyticsAccounts = $gAS->getConnectedAccounts($googleAccount);
        if ($googleAnalyticsAccounts == false) {
            abort(response()->json(['message' => "Unable to fetch google analytics accounts. Possibly no google analytics account exists or access removed by user."], 422));
        }

        $savedGoogleAnalyticAccountIds = GoogleAnalyticsAccount::select('ga_id')->ofCurrentUser()->orderBy('ga_id')->get()->pluck('ga_id')->toArray();

        foreach ($googleAnalyticsAccounts as $index => $googleAnalyticsAccount) {
            if (!in_array($googleAnalyticsAccount['id'], $savedGoogleAnalyticAccountIds)) {
                $nGAA = new GoogleAnalyticsAccount;
                $nGAA->ga_id = $googleAnalyticsAccount['id'];
                $nGAA->name = $googleAnalyticsAccount['name'];
                $nGAA->self_link = $googleAnalyticsAccount['selfLink'];
                $nGAA->permissions = json_encode($googleAnalyticsAccount['permissions']);
                $nGAA->ga_created = new \DateTime($googleAnalyticsAccount['created']);
                $nGAA->ga_updated = new \DateTime($googleAnalyticsAccount['updated']);
                $nGAA->property_type = $googleAnalyticsAccount['childLink']['type'];
                $nGAA->property_href = $googleAnalyticsAccount['childLink']['href'];
                $nGAA->google_account_id = $googleAccount->id;
                $nGAA->user_id = $user->id;
                $nGAA->save();
            }
        }

        $googleAnalyticsAccouts = $user->googleAnalyticsAccounts;
        foreach ($googleAnalyticsAccouts as $googleAnalyticsAccount) {
            $googleAnalyticsProperties = $gAS->getAccountUAProperties($googleAccount, $googleAnalyticsAccount);
            $savedGoogleAnalyticPropertyIds = GoogleAnalyticsProperty::select('property_id')->ofCurrentUser()->orderBy('property_id')->get()->pluck('property_id')->toArray();
            if ($googleAnalyticsProperties != false) {
                foreach ($googleAnalyticsProperties as $index => $googleAnalyticsProperty) {
                    if (!in_array($googleAnalyticsProperty['id'], $savedGoogleAnalyticPropertyIds)) {
                        $gAP = $this->saveGoogleAnalyticsUAPropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user);
                        FetchGAMetricsAndDimensionsJob::dispatch($gAP, '2021-01-01', Carbon::yesterday()->format('Y-m-d'));
                    }
                }
            }

            $googleAnalyticsProperties = $gAS->getAccountGA4Properties($googleAccount, $googleAnalyticsAccount);
            $savedGoogleAnalyticPropertyIds = GoogleAnalyticsProperty::select('property_id')->ofCurrentUser()->orderBy('property_id')->get()->pluck('property_id')->toArray();
            if ($googleAnalyticsProperties != false) {
                foreach ($googleAnalyticsProperties as $index => $googleAnalyticsProperty) {
                    if (!in_array(explode('/', $googleAnalyticsProperty['name'])[1], $savedGoogleAnalyticPropertyIds)) {
                        $gAP = $this->saveGoogleAnalyticsGA4PropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user);
                        FetchGAMetricsAndDimensionsJob::dispatch($gAP, '2021-01-01', Carbon::yesterday()->format('Y-m-d'));
                    }
                }
            }
        }

        return ['success' => true];
    }

    public function destroy(GoogleAnalyticsAccount $googleAnalyticsAccount)
    {
        if (Auth::id() !== $googleAnalyticsAccount->user_id) {
            abort(404, 'Unable to find Google Analytics account with the given id.');
        }

        $googleAnalyticsAccount->delete();
        return ['success' => true];
    }

    private function saveGoogleAnalyticsUAPropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user)
    {
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
        $nGAP->industry_vertical = @$googleAnalyticsProperty['industryVertical'];
        $nGAP->default_profile_id = @$googleAnalyticsProperty['defaultProfileId'];
        $nGAP->data_retention_ttl = @$googleAnalyticsProperty['dataRetentionTtl'];
        $nGAP->ga_created = new \DateTime(@$googleAnalyticsProperty['created']);
        $nGAP->ga_updated = new \DateTime(@$googleAnalyticsProperty['updated']);
        $nGAP->parent_type = @$googleAnalyticsProperty['parentLink']['type'];
        $nGAP->parent_link = @$googleAnalyticsProperty['parentLink']['href'];
        $nGAP->child_type = @$googleAnalyticsProperty['childLink']['type'];
        $nGAP->child_link = @$googleAnalyticsProperty['childLink']['href'];
        $nGAP->permissions = json_encode(@$googleAnalyticsProperty['permissions']);
        $nGAP->google_analytics_account_id = @$googleAnalyticsAccount->id;
        $nGAP->google_account_id = $googleAccount->id;
        $nGAP->user_id = $user->id;
        $nGAP->save();

        return $nGAP;
    }

    private function saveGoogleAnalyticsGA4PropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user)
    {
        $nGAP = new GoogleAnalyticsProperty;
        $nGAP->property_id = explode('/', $googleAnalyticsProperty['name'])[1];
        $nGAP->kind = "analytics#ga4property";
        $nGAP->self_link = @$googleAnalyticsProperty['selfLink'];
        $nGAP->account_id = explode('/', $googleAnalyticsProperty['parent'])[1];
        $nGAP->internal_property_id = explode('/', $googleAnalyticsProperty['name'])[1];
        $nGAP->name = $googleAnalyticsProperty['displayName'];
        $nGAP->website_url = @$googleAnalyticsProperty['websiteUrl'];
        $nGAP->level = @$googleAnalyticsProperty['level'];
        $nGAP->profile_count = @$googleAnalyticsProperty['profileCount'];
        $nGAP->industry_vertical = @$googleAnalyticsProperty['industryCategory'];
        $nGAP->default_profile_id = @$googleAnalyticsProperty['defaultProfileId'];
        $nGAP->data_retention_ttl = @$googleAnalyticsProperty['dataRetentionTtl'];
        $nGAP->ga_created = new \DateTime(@$googleAnalyticsProperty['createTime']);
        $nGAP->ga_updated = new \DateTime(@$googleAnalyticsProperty['updateTime']);
        $nGAP->parent_type = @$googleAnalyticsProperty['parentLink']['type'];
        $nGAP->parent_link = @$googleAnalyticsProperty['parentLink']['href'];
        $nGAP->child_type = @$googleAnalyticsProperty['childLink']['type'];
        $nGAP->child_link = @$googleAnalyticsProperty['childLink']['href'];
        $nGAP->permissions = json_encode(@$googleAnalyticsProperty['permissions']);
        $nGAP->google_analytics_account_id = @$googleAnalyticsAccount->id;
        $nGAP->google_account_id = $googleAccount->id;
        $nGAP->user_id = $user->id;
        $nGAP->save();

        return $nGAP;
    }
}
