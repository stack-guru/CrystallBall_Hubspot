<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Carbon;
use Illuminate\Support\Facades\Log;

use App\Models\ApplePodcastAnnotation;
use Illuminate\Support\Facades\Auth;
use Goutte\Client;

   
class ApplePodcastService {

    //Apple Podcast Searching API
    public function saveApplePodcasts($feedUrl, $url, $userID){

        // if($feedUrl) {

             // $loadXml = simplexml_load_file($feedUrl);
            // foreach($loadXml->channel->item as $item) {
            // }
            
        // } else {

            $client = new Client ();
            $crawler = $client->request('GET', $url);

            // Start: click on the button to load all the remaining records //

            // $crawler

            // End: click on the button to load all the remaining records //


            $crawler->filter('li.tracks__track')->each(function ($node) use ($userID) {
                $date = $node->filter('time')->attr('datetime');
                $url = $node->filter('a.link')->attr('href');
                $title = $node->filter('h2.tracks__track__headline')->text();
                $description = $node->filter('div.we-truncate')->text();
                
                $exist = ApplePodcastAnnotation::where('url', $url)->first();
                if (!$exist) {
                    $annotation = new ApplePodcastAnnotation();
                    $annotation->user_id = $userID;
                    $annotation->category = "Apple Podcast";
                    $annotation->event = $title;
                    $annotation->description = $description;
                    $annotation->url = $url;
                    $annotation->podcast_date = $date;
                    $annotation->save();
                }
            });
        // }

        return true;
    
    }

}