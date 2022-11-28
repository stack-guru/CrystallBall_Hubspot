<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApplePodcastAnnotation;
use App\Models\ApplePodcastMonitor;
use App\Services\ApplePodcastService;
use Illuminate\Support\Facades\Auth;

use Goutte\Client;


class ApplePodcastController extends Controller
{

    public function applePodcastUrl (Request $req) {

        $userID = Auth::user()->id;
        $url = $req->collectionViewUrl;
        $name = $req->collectionName;
        $gaPropertyId = $req->gaPropertyId;
        $feedUrl = $req->feedUrl;

        $exist = ApplePodcastMonitor::where('url', $url)->where('user_id', $userID)->first();

        if(!$exist) {
            $monitor = new ApplePodcastMonitor();

            $monitor->name = $name;
            $monitor->url = $url;
            $monitor->feed_url = $feedUrl;
            $monitor->user_id = $userID;
            $monitor->ga_property_id = $gaPropertyId;
            $monitor->save();
        }

        $applePodcastService = new ApplePodcastService();
        $data = $applePodcastService->saveApplePodcasts($feedUrl, $url, $userID);
        return $data;
    }
 
}
