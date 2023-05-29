<?php

namespace App\Http\Controllers;

use App\Jobs\FacebookCreateAnnotation;
use App\Models\FacebookTrackingConfiguration;
use App\Repositories\FacebookAutomationRepository;
use App\Models\FacebookTrackingAnnotation;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;

class FacebookTrackingConfigurationController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function save(Request $request): JsonResponse
    {
        $request->validate([
            'selected_facebook_pages' => 'required',
        ]);
        $userId = Auth::user()->id;
        $selectedPages = serialize($request->selected_facebook_pages);

        $exists = FacebookTrackingConfiguration::where('user_id', $userId)->where('selected_pages', $selectedPages)->where('ga_property_id', (int)$request->ga_property_id)->first();
        if ($exists) {
            return response()->json([
                'message' => 'Already Exist',
            ], 422);
        }

        $configuration = new FacebookTrackingConfiguration();

        $configuration->user_id = $userId;
        $configuration->when_new_post_on_facebook = (boolean)$request->when_new_post_on_facebook;
        $configuration->when_new_ad_compaign_launched = (boolean)$request->when_new_ad_campaign_launched;
        $configuration->when_ad_compaign_ended = (boolean)$request->when_ad_campaign_ended;
        $configuration->when_changes_on_ad_compaign = (boolean)$request->when_changes_on_ad_campaign;

        $configuration->when_post_reach_likes = (int)$request->when_post_reach_likes;
        $configuration->when_post_reach_comments = (int)$request->when_post_reach_comments;
        $configuration->when_post_reach_shares = (int)$request->when_post_reach_shares;
        $configuration->when_post_reach_views = (int)$request->when_post_reach_views;

        $configuration->is_post_likes_tracking_on = (int)$request->is_post_likes_tracking_on;
        $configuration->is_post_comments_tracking_on = (int)$request->is_post_comments_tracking_on;
        $configuration->is_post_views_tracking_on = (int)$request->is_post_views_tracking_on;
        $configuration->is_post_shares_tracking_on = (int)$request->is_post_shares_tracking_on;
        $configuration->ga_property_id = (int)$request->ga_property_id;
        $configuration->selected_pages = $selectedPages;

        $configuration->save();
        $gaProperty = GoogleAnalyticsProperty::find((int)$request->ga_property_id);

        return response()->json([
            'message' => 'Settings Updated',
            'gaPropertyName' => $gaProperty ? $gaProperty->name : '',
            'configurationId' => $configuration->id
        ]);
    }


    public function runJob (Request $request){
        $configID = $request->id;
        FacebookCreateAnnotation::dispatch(Auth::user()->id, $configID, true);
        return response()->json([
            'status' => true,
        ]);
    }

    /**
     * @return JsonResponse
     */
    public function get(): JsonResponse
    {
        $configurations = FacebookTrackingConfiguration::select('facebook_tracking_configurations.*', 'google_analytics_properties.name AS gaPropertyName')
        ->where('facebook_tracking_configurations.user_id', Auth::user()->id)
        ->leftjoin('google_analytics_properties', 'ga_property_id', 'google_analytics_properties.id')->get();

        foreach($configurations as $config) {
            $config->selected_pages_array = unserialize($config->selected_pages);
        }

        return response()->json(
            compact('configurations')
        );
    }

    public function destroy(FacebookTrackingConfiguration $facebookTrackingConfiguration)
    {
        FacebookTrackingAnnotation::where('configuration_id', $facebookTrackingConfiguration->id)->delete();
        return ['success' => $facebookTrackingConfiguration->delete()];
    }
}
