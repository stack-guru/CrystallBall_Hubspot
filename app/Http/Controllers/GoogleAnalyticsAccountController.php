<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use App\Models\GoogleAnalyticsAccount;
use App\Models\GoogleAnalyticsProperty;
use App\Services\GoogleAnalyticsService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Jobs\FetchGAMetricsAndDimensionsJob;
use Illuminate\Support\Facades\Log;

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

        try {

            $gAS = new GoogleAnalyticsService;
            $googleAnalyticsAccounts = $gAS->getConnectedAccounts($googleAccount);
            //        if ($googleAnalyticsAccounts === false) {
            //            abort(response()->json(['message' => "Unable to fetch google analytics accounts. Possibly no google analytics account exists or access removed by user."], 422));
            //        }

            $savedGoogleAnalyticAccountIds = GoogleAnalyticsAccount::select('ga_id')->ofCurrentUser()->orderBy('ga_id')->get()->pluck('ga_id')->toArray();

            if (!empty($googleAnalyticsAccounts)) {
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
            }

            $googleAnalyticsAccouts = $user->googleAnalyticsAccounts;
            if (!empty($googleAnalyticsAccouts)) {
                foreach ($googleAnalyticsAccouts as $googleAnalyticsAccount) {
                    $googleAnalyticsProperties = $gAS->getAccountUAProperties($googleAccount, $googleAnalyticsAccount);
                    if ($googleAnalyticsProperties != false) {
                        foreach ($googleAnalyticsProperties as $index => $googleAnalyticsProperty) {
                            /**
                             * This simple duplicate prevention is no longer needed
                             * as the saving function uses createOrUpdate method to prevent duplication
                             * with relevant parameters
                             */
                            // if (!in_array($googleAnalyticsProperty['id'], $savedGoogleAnalyticPropertyIds)) {
                            $gAP = $this->saveGoogleAnalyticsUAPropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user);
                            FetchGAMetricsAndDimensionsJob::dispatch($gAP, '2021-01-01', Carbon::yesterday()->format('Y-m-d'));
                            // }
                        }
                    }

                    $googleAnalyticsProperties = $gAS->getAccountGA4Properties($googleAccount, $googleAnalyticsAccount);
                    if ($googleAnalyticsProperties != false) {
                        foreach ($googleAnalyticsProperties as $index => $googleAnalyticsProperty) {
                            /**
                             * This simple duplicate prevention is no longer needed
                             * as the saving function uses createOrUpdate method to prevent duplication
                             * with relevant parameters
                             */
                            // if (!in_array(explode('/', $googleAnalyticsProperty['name'])[1], $savedGoogleAnalyticPropertyIds)) {
                            $gAP = $this->saveGoogleAnalyticsGA4PropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user);
                            FetchGAMetricsAndDimensionsJob::dispatch($gAP, '2021-01-01', Carbon::yesterday()->format('Y-m-d'));
                            // }
                        }
                    }
                }
            }
        } catch (\Exception $exception) {
            Log::error($exception->getMessage(), [
                $exception->getCode(),
                $exception->getLine(),
                $exception->getFile(),
            ]);
            return ['success' => false];
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
        $colors = GoogleAnalyticsProperty::getColors();

        $nGAP = GoogleAnalyticsProperty::updateOrCreate([
            'property_id' => $googleAnalyticsProperty['id'],
            'google_analytics_account_id' => @$googleAnalyticsAccount->id,
            'google_account_id' => $googleAccount->id,
            'user_id' => $user->id,
        ], [
            'account_id' => $googleAnalyticsProperty['accountId'],
            'kind' => $googleAnalyticsProperty['kind'],
            'self_link' => $googleAnalyticsProperty['selfLink'],
            'internal_property_id' => $googleAnalyticsProperty['internalWebPropertyId'],
            'name' => $googleAnalyticsProperty['name'],
            'website_url' => key_exists('websiteUrl', $googleAnalyticsProperty) ? $googleAnalyticsProperty['websiteUrl'] : null,
            'level' => $googleAnalyticsProperty['level'],
            'profile_count' => $googleAnalyticsProperty['profileCount'],
            'industry_vertical' => @$googleAnalyticsProperty['industryVertical'],
            'default_profile_id' => @$googleAnalyticsProperty['defaultProfileId'],
            'data_retention_ttl' => @$googleAnalyticsProperty['dataRetentionTtl'],
            'ga_created' => new \DateTime(@$googleAnalyticsProperty['created']),
            'ga_updated' => new \DateTime(@$googleAnalyticsProperty['updated']),
            'parent_type' => @$googleAnalyticsProperty['parentLink']['type'],
            'parent_link' => @$googleAnalyticsProperty['parentLink']['href'],
            'child_type' => @$googleAnalyticsProperty['childLink']['type'],
            'child_link' => @$googleAnalyticsProperty['childLink']['href'],
            'permissions' => json_encode(@$googleAnalyticsProperty['permissions']),
            'color_hex_code' => $colors[rand(0, count($colors) - 1)],
        ]);

        return $nGAP;
    }

    private function saveGoogleAnalyticsGA4PropertyToDatabase($googleAnalyticsProperty, $googleAnalyticsAccount, $googleAccount, $user)
    {
        $colors = GoogleAnalyticsProperty::getColors();

        $nGAP = GoogleAnalyticsProperty::updateOrCreate([
            'property_id' => explode('/', $googleAnalyticsProperty['name'])[1],
            'google_analytics_account_id' => @$googleAnalyticsAccount->id,
            'google_account_id' => $googleAccount->id,
            'user_id' => $user->id,
        ], [
            'kind' => "analytics#ga4property",
            'self_link' => @$googleAnalyticsProperty['selfLink'],
            'account_id' => explode('/', $googleAnalyticsProperty['parent'])[1],
            'internal_property_id' => explode('/', $googleAnalyticsProperty['name'])[1],
            'name' => $googleAnalyticsProperty['displayName'],
            'website_url' => key_exists('websiteUrl', $googleAnalyticsProperty) ? $googleAnalyticsProperty['websiteUrl'] : null,
            'level' => @$googleAnalyticsProperty['level'],
            'profile_count' => @$googleAnalyticsProperty['profileCount'],
            'industry_vertical' => key_exists('industryVertical', $googleAnalyticsProperty) ? $googleAnalyticsProperty['industryVertical'] : (key_exists('industryCategory', $googleAnalyticsProperty) ? $googleAnalyticsProperty['industryCategory'] : null),
            'default_profile_id' => @$googleAnalyticsProperty['defaultProfileId'],
            'data_retention_ttl' => @$googleAnalyticsProperty['dataRetentionTtl'],
            'ga_created' => new \DateTime(key_exists('createTime', $googleAnalyticsProperty) ? $googleAnalyticsProperty['createTime'] : (key_exists('created', $googleAnalyticsProperty) ? $googleAnalyticsProperty['created'] : null)),
            'ga_updated' => new \DateTime(key_exists('updateTime', $googleAnalyticsProperty) ? $googleAnalyticsProperty['updateTime'] : (key_exists('updated', $googleAnalyticsProperty) ? $googleAnalyticsProperty['updated'] : null)),
            'parent_type' => @$googleAnalyticsProperty['parentLink']['type'],
            'parent_link' => @$googleAnalyticsProperty['parentLink']['href'],
            'child_type' => @$googleAnalyticsProperty['childLink']['type'],
            'child_link' => @$googleAnalyticsProperty['childLink']['href'],
            'permissions' => json_encode(@$googleAnalyticsProperty['permissions']),
            'color_hex_code' => $colors[rand(0, count($colors) - 1)],
        ]);

        return $nGAP;
    }
}
