<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Models\ApplePodcastAnnotation;
use Illuminate\Support\Facades\Auth;
use App\Mail\AdminFailedApplePodcastScriptMail;
use Goutte\Client;
use App\Models\Admin;
   
class ApplePodcastService {
    private $scrappingServerUrl;
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct()
    {
        $this->scrappingServerUrl = config('services.apple_podcast.data_api_url');
    }

    //Apple Podcast Scrapping API
    public function saveApplePodcasts($feedUrl, $url, $userID){
        try {

            $reqBody = [
                'podcastUrl' => $url
            ];

            $response = Http::post($this->scrappingServerUrl . '/apple-podcast-episodes', $reqBody);

            if (!$response->successful()) {
                throw Error('Error while scrapping data');
                return false;
            }

            $result = $response['episodesResult'];
            $length = count($result);
            for ($i = 0; $i < $length; $i++) {
                $exist = ApplePodcastAnnotation::where('url', $result[$i]['url'])->first();
                if (!$exist) {
                    $annotation = new ApplePodcastAnnotation();
                    $annotation->user_id = $userID;
                    $annotation->category = "Apple Podcast";
                    $annotation->event = $result[$i]['title'];
                    $annotation->description = $result[$i]['description'];
                    $annotation->url = $result[$i]['url'];
                    $annotation->podcast_date = $result[$i]['date'];
                    $annotation->save();
                }
            }
            return true;
        } catch (\Exception $e) {
            Log::channel('ApplePodcast Error')->debug($e);
            $admin = Admin::first();
            $message = "Apple Podcast script is crashed. Please have a look into the code to fix!";
            Mail::to($admin)->send(new AdminFailedApplePodcastScriptMail($admin, $e));
            Log::error($e);
            return false;
        }

    
    }

}