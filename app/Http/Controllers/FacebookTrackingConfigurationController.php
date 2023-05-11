<?php

namespace App\Http\Controllers;

use App\Models\FacebookTrackingConfiguration;
use App\Models\GoogleAnalyticsProperty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        FacebookTrackingConfiguration::updateOrCreate(
            [
                'user_id' => Auth::user()->id,
            ],
            [
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
                'selected_pages' => serialize($request->selected_facebook_pages),
                'configuration_id' => true,
            ]
        );

        $gaPropertyName = GoogleAnalyticsProperty::find((int)$request->ga_property_id)->name;

        return response()->json([
            'message' => 'Settings Updated',
            'gaPropertyName' => $gaPropertyName
        ]);
    }


    /**
     * @return JsonResponse
     */
    public function get(): JsonResponse
    {
        $FacebookTrackingConfiguration = FacebookTrackingConfiguration::where('user_id', Auth::user()->id)->first();
        if ($FacebookTrackingConfiguration){
            return response()->json([
                'configuration_id' => true,

                'when_new_post_on_facebook' => (bool)$FacebookTrackingConfiguration->when_new_post_on_facebook,
                'when_new_ad_compaign_launched' => (bool)$FacebookTrackingConfiguration->when_new_ad_compaign_launched,
                'when_ad_compaign_ended' => (bool)$FacebookTrackingConfiguration->when_ad_compaign_ended,
                'when_changes_on_ad_compaign' => (bool)$FacebookTrackingConfiguration->when_changes_on_ad_compaign,

                'when_post_reach_likes' => (int)$FacebookTrackingConfiguration->when_post_reach_likes,
                'when_post_reach_comments' => (int)$FacebookTrackingConfiguration->when_post_reach_comments,
                'when_post_reach_shares' => (int)$FacebookTrackingConfiguration->when_post_reach_shares,
                'when_post_reach_views' => (int)$FacebookTrackingConfiguration->when_post_reach_views,

                'is_post_likes_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_likes_tracking_on,
                'is_post_comments_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_comments_tracking_on,
                'is_post_views_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_views_tracking_on,
                'is_post_shares_tracking_on' => (int)$FacebookTrackingConfiguration->is_post_shares_tracking_on,

                'ga_property_id' => (int)$FacebookTrackingConfiguration->ga_property_id,
                'gaPropertyName' => GoogleAnalyticsProperty::find((int)$FacebookTrackingConfiguration->ga_property_id)->name,

                'selected_pages' => unserialize($FacebookTrackingConfiguration->selected_pages) ?? [],
            ]);
        }
        else{
            return response()->json([
                'configuration_id' => null,
                'when_new_post_on_facebook' => true,
                'when_new_ad_compaign_launched' => true,
                'when_ad_compaign_ended' => true,
                'when_changes_on_ad_compaign' => true,

                'is_post_likes_tracking_on' => true,
                'is_post_comments_tracking_on' => true,
                'is_post_views_tracking_on' => true,
                'is_post_shares_tracking_on' => true,

                'when_post_reach_likes' => 1000,
                'when_post_reach_comments' => 1000,
                'when_post_reach_shares' => 1000,
                'when_post_reach_views' => 1000,

                'ga_property_id' => null,

                'selected_pages' => [],
            ]);
        }
    }
}
