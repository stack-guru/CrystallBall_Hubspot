<?php

namespace App\Http\Controllers;

use App\Services\YouTubeService;

class YouTubeController extends Controller
{
    protected $youtubeService;

    public function __construct(YouTubeService $youtubeService)
    {
        $this->youtubeService = $youtubeService;
    }

    public function getChannel($channelId)
    {
        $channel = $this->youtubeService->getChannelById($channelId);

        return response()->json($channel);
    }

    public function getVideos($channelId)
    {
        $videos = $this->youtubeService->getVideosByChannelId($channelId);

        return response()->json($videos);
    }
}
