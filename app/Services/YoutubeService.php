<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use App\Models\YoutubeAnnotation;
use Illuminate\Support\Carbon;
use Illuminate\Http\Client\ConnectionException;

class YouTubeService
{

    private $apiKey;
    private $baseUrl;

    /**
     * @throws FacebookSDKException
     */
    public function __construct()
    {
        $this->apiKey = config('services.youtube.api_key');
        $this->baseUrl = "https://www.googleapis.com/youtube/v3";
    }

    public function isValidUrl($channelName)
    {
        $response = Http::get("$this->baseUrl/search?part=id&q=@$channelName&type=channel&key=$this->apiKey");
        if ($response->failed()) {
            $error = $response->body();
            return ['success' => false, 'message' => $error];
        }
        return true;
    }

    public function storeVideosData($user, $channelName, $configuration)
    {
        $channelDetail = Http::get("$this->baseUrl/search?part=id&q=@$channelName&type=channel&key=$this->apiKey");
        if (@$channelDetail['items']) {
            foreach($channelDetail['items'] as $item) {
                $channelId = @$item['id']['channelId'];
                if($channelId)
                    $this->getVideosByChannelId($user, $channelId, $configuration);
            }
        }
    }

    public function getVideosByChannelId($user, $channelId, $configuration)
    {
        $channel = Http::get("$this->baseUrl/search?part=snippet&channelId=$channelId&key=$this->apiKey");
        foreach(@$channel['items'] as $item) {
            $videoId = @$item['id']['videoId'];
            if($videoId)
                $this->getVideosData($user, $videoId, $configuration);
        }
    }

    public function getVideosData($user, $videoId, $configuration)
    {

        $videos = Http::get("$this->baseUrl/videos?part=snippet,statistics&id=$videoId&key=$this->apiKey");

        foreach($videos['items'] as $item) {

            $statistics = $item['statistics'];
            $viewCount = @$statistics['viewCount'];
            $likeCount = @$statistics['likeCount'];
            $commentCount = @$statistics['commentCount'];

            $snippet = @$item['snippet'];
            $title = @$snippet['title'];
            $description = @$snippet['description'];
            $publishedAt = @Carbon::parse(@$snippet['publishedAt']);

            if($configuration->old_videos_uploaded) {
                $exist = YoutubeAnnotation::where('user_id', $user->id)
                    ->where('monitor_id', $configuration->id)
                    ->where('url', "https://www.youtube.com/watch?v=" . $videoId)
                    ->where('description', "A new video on youtube channel.")
                    ->where('date', '<', Carbon::now())
                    ->first();
                if (!$exist) {
                    $this->saveAnnotation($user, $videoId, $title, "A new video on youtube channel.", $publishedAt, $configuration->id);
                }
            }

            if($configuration->new_videos_uploaded) {
                $exist = YoutubeAnnotation::where('user_id', $user->id)
                    ->where('monitor_id', $configuration->id)
                    ->where('url', "https://www.youtube.com/watch?v=" . $videoId)
                    ->where('description', "A new video on youtube channel.")
                    ->where('date', Carbon::today()->format('H:i:m'))
                    ->first();
                if (!$exist) {
                    $this->saveAnnotation($user, $videoId, $title, "A new video on youtube channel.", $publishedAt, $configuration->id);
                }
            }

            if($configuration->is_video_likes_tracking_on) {
                if ( $likeCount >= $configuration->when_video_reach_likes ) {
                    $desc = "A post on youtube reached ".$likeCount." likes.";
                    $this->saveAnnotation($user, $videoId, $title, $desc, $publishedAt, $configuration->id);
                }
            }

            if($configuration->is_video_comments_tracking_on) {
                if ( $commentCount >= $configuration->when_video_reach_comments ) {
                    $desc = "A post on youtube reached ".$commentCount." comments.";
                    $this->saveAnnotation($user, $videoId, $title, $desc, $publishedAt, $configuration->id);
                }
            }

            if($configuration->is_video_views_tracking_on) {
                if ( $viewCount >= $configuration->when_video_reach_views ) {
                    $desc = "A post on youtube reached ".$viewCount." views.";
                    $this->saveAnnotation($user, $videoId, $title, $desc, $publishedAt, $configuration->id);
                }
            }

        }

        return true;
    }

    public function saveAnnotation ($user, $videoId, $title, $desc, $publishedAt, $configurationId) {
        $match = ['monitor_id' => $configurationId, 'description' => $desc, 'url' => "https://www.youtube.com/watch?v=" . $videoId];
        YoutubeAnnotation::updateOrCreate($match, [
            'user_id' => $user->id,
            'category' => 'Youtube',
            'event' => $title,
            'url' => "https://www.youtube.com/watch?v=" . $videoId,
            'description' => $desc,
            'monitor_id' => $configurationId,
            'date' => $publishedAt,
        ]);
        // dd(123);
    }
}











// https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=@muhammadalimirzaspeeches&key=301040226881-5mfhtgh35fqkpnu9lfk97qtgc883stdd.apps.googleusercontent.com

// https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=@CrystalBallinsight&key=AIzaSyB10laKwXsUbVgcQI0UNvThpkdhKWwEsXY


// https://www.googleapis.com/youtube/v3/search?part=id&maxResults=1&q=@CrystalBallinsight&type=channel&key=AIzaSyB10laKwXsUbVgcQI0UNvThpkdhKWwEsXY


// https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCuFwzKrS0wE43CSkyaHBGiQ&key=AIzaSyB10laKwXsUbVgcQI0UNvThpkdhKWwEsXY

// https://www.googleapis.com/youtube/v3/videos?part=statistics&id=h8L2JfZuIxE&key=AIzaSyADs-h4iu9hBZCFbT9iI6s17y-3uxJQFqI


https://www.googleapis.com/youtube/v3/search?part=id&q=@111111111111111111111&type=channel&key=AIzaSyB10laKwXsUbVgcQI0UNvThpkdhKWwEsXY