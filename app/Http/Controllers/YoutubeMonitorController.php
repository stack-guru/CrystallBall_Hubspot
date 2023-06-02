<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\YoutubeAnnotation;
use App\Models\YoutubeMonitor;
use App\Services\YoutubeService;
use Illuminate\Support\Facades\Auth;

use Goutte\Client;


class YoutubeMonitorController extends Controller
{

    protected $youtubeService;
    public function __construct()
    {
        $this->youtubeService = new YouTubeService();
    }

    public function save(Request $request)
    {
        $userId = Auth::user()->id;

        if (!$request->url) {
            return response()->json([
                'message' => 'Url is not provided',
            ], 422);
        }

        if (!@explode('@', $request->url)[1]) {
            return response()->json([
                'message' => 'The provided url is not correct!',
            ], 422);
        }
        
        $exists = YoutubeMonitor::where('user_id', $userId)->where('url', $request->url)->where('ga_property_id', (int)$request->ga_property_id)->first();
        if ($exists) {
            return response()->json([
                'message' => 'Already Exist',
            ], 422);
        }

        $channelName = explode('@', $request->url)[1];
        $response = $this->youtubeService->isValidUrl($channelName);
        if ($response !== true) {
            return response()->json(config('services.youtube.api_key'), 400);
        }

        $configuration = new YoutubeMonitor();

        $configuration->user_id = $userId;
        $configuration->old_videos_uploaded = (boolean)$request->old_videos_uploaded;
        $configuration->new_videos_uploaded = (boolean)$request->new_videos_uploaded;

        $configuration->when_video_reach_likes = (int)$request->when_video_reach_likes;
        $configuration->is_video_likes_tracking_on = (boolean)$request->is_video_likes_tracking_on;

        $configuration->when_video_reach_comments = (int)$request->when_video_reach_comments;
        $configuration->is_video_comments_tracking_on = (boolean)$request->is_video_comments_tracking_on;

        $configuration->when_video_reach_views = (int)$request->when_video_reach_views;
        $configuration->is_video_views_tracking_on = (boolean)$request->is_video_views_tracking_on;

        $configuration->ga_property_id = (int)$request->ga_property_id;
        $configuration->url = $request->url;

        $configuration->save();

        $this->youtubeService->storeVideosData(Auth::user(), $channelName, $configuration);

        return response()->json([
            'message' => 'Settings Updated',
        ]);
    }

    public function get()
    {

        $configurations = YoutubeMonitor::select('youtube_monitors.*', 'google_analytics_properties.name AS gaPropertyName')
        ->where('youtube_monitors.user_id', Auth::user()->id)
        ->leftjoin('google_analytics_properties', 'ga_property_id', 'google_analytics_properties.id')->get();

        return response()->json(
            compact('configurations')
        );
    }

    public function destroy(YoutubeMonitor $youtubeMonitor)
    {
        YoutubeAnnotation::where('monitor_id', $youtubeMonitor->id)->delete();
        return ['success' => $youtubeMonitor->delete()];
    }

}
