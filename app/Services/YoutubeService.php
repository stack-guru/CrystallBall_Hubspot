<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Models\YoutubeAnnotation;
use Illuminate\Support\Facades\Auth;
use App\Mail\AdminFailedYoutubeScriptMail;
use Goutte\Client;
use App\Models\Admin;
use Error;

class YoutubeService {
    private $scrappingServerUrl;
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct()
    {
        $this->scrappingServerUrl = config('services.youtube_monitor.data_api_url');
    }

    //Youtube Scrapping API
    public function saveYoutubeAnnotations($feedUrl, $url, $userID){
        try {

            $reqBody = [
                'monitorUrl' => $url
            ];

            $response = Http::post($this->scrappingServerUrl . '/youtube-monitors', $reqBody);

            if (!$response->successful()) {
                throw new Error('Error while scrapping data');
            }

            // $result = $response['episodesResult'];
            $length = count($result);
            for ($i = 0; $i < $length; $i++) {
                $exist = YoutubeAnnotation::where('url', $result[$i]['url'])->first();
                if (!$exist) {
                    $annotation = new YoutubeAnnotation();
                    $annotation->user_id = $userID;
                    $annotation->category = "Youtube Monitor";
                    $annotation->event = $result[$i]['title'];
                    $annotation->description = $result[$i]['description'];
                    $annotation->url = $result[$i]['url'];
                    $annotation->date = $result[$i]['date'];
                    $annotation->save();
                }
            }
            return true;
        } catch (\Exception $e) {
            Log::channel('YoutubeMonitor Error')->debug($e);
            $admin = Admin::first();
            $message = "Youtube Monitor script is crashed. Please have a look into the code to fix!";
            Mail::to($admin)->send(new AdminFailedYoutubeScriptMail($admin, $e));
            Log::error($e);
            return $e;
        }

    
    }

}