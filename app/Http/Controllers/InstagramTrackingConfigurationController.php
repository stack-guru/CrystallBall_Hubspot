<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;
use App\Models\InstagramTrackingConfiguration;
use App\Models\InstagramTrackingAnnotation;
use App\Jobs\InstagramCreateAnnotation;
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

        $userId = Auth::user()->id;
        $exists = InstagramTrackingConfiguration::where('user_id', $userId)->where('ga_property_id', (int)$request->ga_property_id)->first();
        if ($exists) {
            return response()->json([
                'message' => 'Already Exist',
            ], 422);
        }

        $configuration = new InstagramTrackingConfiguration();

        $configuration->user_id = $userId;
        $configuration->when_new_post_on_instagram = (boolean)$request->when_new_post_on_instagram;

        $configuration->when_post_reach_likes = (int)$request->when_post_reach_likes;
        $configuration->when_post_reach_comments = (int)$request->when_post_reach_comments;
        $configuration->when_post_reach_shares = (int)$request->when_post_reach_shares;
        $configuration->when_post_reach_views = (int)$request->when_post_reach_views;

        $configuration->is_post_likes_tracking_on = (int)$request->is_post_likes_tracking_on;
        $configuration->is_post_comments_tracking_on = (int)$request->is_post_comments_tracking_on;
        $configuration->is_post_views_tracking_on = (int)$request->is_post_views_tracking_on;
        $configuration->is_post_shares_tracking_on = (int)$request->is_post_shares_tracking_on;
        $configuration->ga_property_id = (int)$request->ga_property_id;

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
        InstagramCreateAnnotation::dispatch(Auth::user()->id, $configID, true);
        return response()->json([
            'status' => true,
        ]);
    }


    /**
     * @return JsonResponse
     */
    public function get(): JsonResponse
    {

        $configurations = InstagramTrackingConfiguration::select('instagram_tracking_configurations.*', 'google_analytics_properties.name AS gaPropertyName')
        ->where('instagram_tracking_configurations.user_id', Auth::user()->id)
        ->leftjoin('google_analytics_properties', 'ga_property_id', 'google_analytics_properties.id')->get();

        return response()->json(
            compact('configurations')
        );
    }

    public function destroy(InstagramTrackingConfiguration $instagramTrackingConfiguration)
    {
        InstagramTrackingAnnotation::where('configuration_id', $instagramTrackingConfiguration->id)->delete();
        return ['success' => $instagramTrackingConfiguration->delete()];
    }
}
