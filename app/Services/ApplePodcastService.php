<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;

use App\Models\ApplePodcastAnnotation;
use Goutte\Client;

   
class ApplePodcastService {

    //Apple Podcast Searching API
    public function getAllApplePodcasts(ApplePodcastAnnotation $ApplePodcastAnnotation){

        $url = "https://podcasts.apple.com/us/podcast/apple-events-audio/id1473854035";

        // $client = new Client ();
        
    }

}