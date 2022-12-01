<?php

namespace App\Http\Controllers;

use App\Models\TwitterTrackingConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TwitterTrackingConfigurationController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function save(Request $request): JsonResponse
    {
        TwitterTrackingConfiguration::updateOrCreate(
            [
                'user_id' => Auth::user()->id,
            ],
            [
                'is_tweets_likes_tracking_on'    => (boolean) $request->is_tweets_likes_tracking_on,
                'when_tweet_reach_likes'         => (int) $request->when_tweet_reach_likes,
                'is_tweets_retweets_tracking_on' => (boolean) $request->is_tweets_retweets_tracking_on,
                'when_tweet_reach_retweets'      => (int) $request->when_tweet_reach_retweets,
            ]
        );

        return response()->json([
            'message' => 'Settings Updated',
        ]);
    }

    /**
     * @return JsonResponse
     */
    public function get(): JsonResponse
    {
        $authId = Auth::id();
        $config = TwitterTrackingConfiguration::where('user_id', $authId)->first();

        return response()->json([
            'is_tweets_likes_tracking_on'    => (boolean) ($config->is_tweets_likes_tracking_on ?? false),
            'when_tweet_reach_likes'         => (int) ($config->when_tweet_reach_likes ?? 0),
            'is_tweets_retweets_tracking_on' => (boolean) ($config->is_tweets_retweets_tracking_on ?? false),
            'when_tweet_reach_retweets'      => (int) ($config->when_tweet_reach_retweets ?? 0),
        ]);
    }
}
