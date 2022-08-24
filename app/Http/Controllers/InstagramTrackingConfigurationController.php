<?php

namespace App\Http\Controllers;

use App\Models\InstagramTrackingConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InstagramTrackingConfigurationController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function save(Request $request): JsonResponse
    {
        $request->validate([
            // 'selected_facebook_pages' => 'required',
        ]);

        InstagramTrackingConfiguration::updateOrCreate(
            [
                'user_id' => Auth::user()->id,
            ],
            [
                'when_new_post_on_instagram' => (boolean)$request->when_new_post_on_instagram,

                'when_post_reach_likes' => (int)$request->when_post_reach_likes,
                'when_post_reach_comments' => (int)$request->when_post_reach_comments,
                'when_post_reach_shares' => (int)$request->when_post_reach_shares,
                'when_post_reach_views' => (int)$request->when_post_reach_views,

                'is_post_likes_tracking_on' => (int)$request->is_post_likes_tracking_on,
                'is_post_comments_tracking_on' => (int)$request->is_post_comments_tracking_on,
                'is_post_views_tracking_on' => (int)$request->is_post_views_tracking_on,
                'is_post_shares_tracking_on' => (int)$request->is_post_shares_tracking_on,

            ]
        );

        return response()->json([
            'message' => 'Settings Updated'
        ]);
    }


    /**
     * @return JsonResponse
     */
    public function get(): JsonResponse
    {
        $InstagramTrackingConfiguration = InstagramTrackingConfiguration::where('user_id', Auth::user()->id)->first();
        if ($InstagramTrackingConfiguration){
            return response()->json([
                'when_new_post_on_instagram' => (bool)$InstagramTrackingConfiguration->when_new_post_on_instagram,

                'when_post_reach_likes' => (int)$InstagramTrackingConfiguration->when_post_reach_likes,
                'when_post_reach_comments' => (int)$InstagramTrackingConfiguration->when_post_reach_comments,
                'when_post_reach_shares' => (int)$InstagramTrackingConfiguration->when_post_reach_shares,
                'when_post_reach_views' => (int)$InstagramTrackingConfiguration->when_post_reach_views,

                'is_post_likes_tracking_on' => (int)$InstagramTrackingConfiguration->is_post_likes_tracking_on,
                'is_post_comments_tracking_on' => (int)$InstagramTrackingConfiguration->is_post_comments_tracking_on,
                'is_post_views_tracking_on' => (int)$InstagramTrackingConfiguration->is_post_views_tracking_on,
                'is_post_shares_tracking_on' => (int)$InstagramTrackingConfiguration->is_post_shares_tracking_on,
            ]);
        }
        else{
            return response()->json([
                'when_new_post_on_instagram' => true,

                'is_post_likes_tracking_on' => true,
                'is_post_comments_tracking_on' => true,
                'is_post_views_tracking_on' => true,
                'is_post_shares_tracking_on' => true,

                'when_post_reach_likes' => 1000,
                'when_post_reach_comments' => 1000,
                'when_post_reach_shares' => 1000,
                'when_post_reach_views' => 1000,
            ]);
        }
    }
}
