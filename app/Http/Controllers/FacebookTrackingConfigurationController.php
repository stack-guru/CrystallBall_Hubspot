<?php

namespace App\Http\Controllers;

use App\Jobs\FacebookCreateAnnotation;
use App\Models\FacebookTrackingConfiguration;
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

        FacebookTrackingConfiguration::insert(
            [
                'user_id' => $userId,
                'when_new_post_on_facebook' => (boolean)$request->when_new_post_on_facebook,
                'when_new_ad_compaign_launched' => (boolean)$request->when_new_ad_campaign_launched,
                'when_ad_compaign_ended' => (boolean)$request->when_ad_campaign_ended,
                'when_changes_on_ad_compaign' => (boolean)$request->when_changes_on_ad_campaign,

                'when_post_reach_likes' => (int)$request->when_post_reach_likes,
                'when_post_reach_comments' => (int)$request->when_post_reach_comments,
                'when_post_reach_shares' => (int)$request->when_post_reach_shares,
                'when_post_reach_views' => (int)$request->when_post_reach_views,

                'is_post_likes_tracking_on' => (int)$request->is_post_likes_tracking_on,
                'is_post_comments_tracking_on' => (int)$request->is_post_comments_tracking_on,
                'is_post_views_tracking_on' => (int)$request->is_post_views_tracking_on,
                'is_post_shares_tracking_on' => (int)$request->is_post_shares_tracking_on,

                'ga_property_id' => (int)$request->ga_property_id,
                'selected_pages' => $selectedPages,
            ]
        );

        $gaProperty = GoogleAnalyticsProperty::find((int)$request->ga_property_id);

        return response()->json([
            'message' => 'Settings Updated',
            'gaPropertyName' => $gaProperty ? $gaProperty->name : ''
        ]);
    }


    public function runJob (){
        FacebookCreateAnnotation::dispatch(Auth::user()->id);
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
        // if ($FacebookTrackingConfiguration){
        //     return response()->json([
        //         'configuration_id' => $FacebookTrackingConfiguration->ga_property_id || false,

        //         'when_new_post_on_facebook' => (bool)$FacebookTrackingConfiguration->when_new_post_on_facebook,
        //         'when_new_ad_compaign_launched' => (bool)$FacebookTrackingConfiguration->when_new_ad_compaign_launched,
        //         'when_ad_compaign_ended' => (bool)$FacebookTrackingConfiguration->when_ad_compaign_ended,
        //         'when_changes_on_ad_compaign' => (bool)$FacebookTrackingConfiguration->when_changes_on_ad_compaign,

        //         'when_post_reach_likes' => (int)$FacebookTrackingConfiguration->when_post_reach_likes,
        //         'when_post_reach_comments' => (int)$FacebookTrackingConfiguration->when_post_reach_comments,
        //         'when_post_reach_shares' => (int)$FacebookTrackingConfiguration->when_post_reach_shares,
        //         'when_post_reach_views' => (int)$FacebookTrackingConfiguration->when_post_reach_views,

        //         'is_post_likes_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_likes_tracking_on,
        //         'is_post_comments_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_comments_tracking_on,
        //         'is_post_views_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_views_tracking_on,
        //         'is_post_shares_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_shares_tracking_on,

        //         'ga_property_id' => (int)$FacebookTrackingConfiguration->ga_property_id,
        //         'gaPropertyName' => $FacebookTrackingConfiguration->ga_property_id ? GoogleAnalyticsProperty::find((int)$FacebookTrackingConfiguration->ga_property_id)->name : "",

        //         'selected_pages' => unserialize($FacebookTrackingConfiguration->selected_pages) ?? [],
        //     ]);
        // }
        // else{
        //     return response()->json([
        //         'configuration_id' => null,
        //         'when_new_post_on_facebook' => true,
        //         'when_new_ad_compaign_launched' => true,
        //         'when_ad_compaign_ended' => true,
        //         'when_changes_on_ad_compaign' => true,

        //         'is_post_likes_tracking_on' => true,
        //         'is_post_comments_tracking_on' => true,
        //         'is_post_views_tracking_on' => true,
        //         'is_post_shares_tracking_on' => true,

        //         'when_post_reach_likes' => 1000,
        //         'when_post_reach_comments' => 1000,
        //         'when_post_reach_shares' => 1000,
        //         'when_post_reach_views' => 1000,

        //         'ga_property_id' => null,

        //         'selected_pages' => [],
        //     ]);
        // }
    }

    public function destroy(FacebookTrackingConfiguration $facebookTrackingConfiguration)
    {
        return ['success' => $facebookTrackingConfiguration->delete()];
    }
}
