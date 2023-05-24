<?php

namespace App\Http\Controllers;

use App\Models\GoogleAnalyticsProperty;
use App\Models\TwitterTrackingConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

class TwitterTrackingConfigurationController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function save(Request $request): JsonResponse
    {
        $userId = Auth::id();

        TwitterTrackingConfiguration::updateOrCreate(
            [
                'user_id' => $userId,
            ],
            [
                'is_tweets_likes_tracking_on'    => (boolean) $request->is_tweets_likes_tracking_on,
                'when_tweet_reach_likes'         => (int) $request->when_tweet_reach_likes,
                'is_tweets_retweets_tracking_on' => (boolean) $request->is_tweets_retweets_tracking_on,
                'when_tweet_reach_retweets'      => (int) $request->when_tweet_reach_retweets,
                'ga_property_id' => (int)$request->ga_property_id,
            ]
        );

        Artisan::call('gaa:create-annotations-of-twitter', [
            'user' => $userId,
        ]);

        $gaProperty = GoogleAnalyticsProperty::find((int)$request->ga_property_id);
        return response()->json([
            'message' => 'Settings Updated',
            'gaPropertyName' => $gaProperty ? $gaProperty->name : ''
        ]);
    }

    /**
     * @return JsonResponse
     */
    public function get(): JsonResponse
    {
        $authId = Auth::id();
        $config = TwitterTrackingConfiguration::where('user_id', $authId)->first();

        if (!$config) {
            return response()->json([]);
        }

        return response()->json([
            'configuration_id' => $config->ga_property_id || false,
            'is_tweets_likes_tracking_on'    => (boolean) ($config->is_tweets_likes_tracking_on ?? false),
            'when_tweet_reach_likes'         => (int) ($config->when_tweet_reach_likes ?? 0),
            'is_tweets_retweets_tracking_on' => (boolean) ($config->is_tweets_retweets_tracking_on ?? false),
            'when_tweet_reach_retweets'      => (int) ($config->when_tweet_reach_retweets ?? 0),
            'ga_property_id' => (int)$config->ga_property_id,
            'gaPropertyName' => $config->ga_property_id ? GoogleAnalyticsProperty::find((int)$config->ga_property_id)->name : "",
        ]);
    }
}
