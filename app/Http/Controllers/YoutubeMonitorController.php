<?php

namespace App\Http\Controllers;

use App\Http\Requests\YoutubeMonitorRequest;
use Illuminate\Http\Request;
use App\Models\YoutubeAnnotation;
use App\Models\YoutubeMonitor;
use App\Services\YoutubeService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

use Goutte\Client;


class YoutubeMonitorController extends Controller
{


    public function index(Request $request)
    {
        if ($request->query('ga_property_id') !== "null" && $request->query('ga_property_id')) {
            return ['youtube_monitors' => YoutubeMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->where('ga_property_id', $request->query('ga_property_id'))->get()];
        }
        return ['youtube_monitors' => YoutubeMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->get()];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(YoutubeMonitorRequest $request)
    {

        $authUser = Auth::user();
        $pricePlan = $authUser->pricePlan;
        $youtubeCount = YoutubeMonitor::ofCurrentUser()->count();

        if ($pricePlan->youtube_credits_count <= $youtubeCount) {
            return response()->json(['message' => 'Maximum number of monitors limit reached'], 422);
        }

        if (YoutubeMonitor::where('url', $request->url)->ofCurrentUser()->count()) {
            return response()->json(['message' => 'We already have this monitor setup.'], 402);
        }

        $youtubeMonitor = new YoutubeMonitor;
        $youtubeMonitor->fill($request->validated());
        $youtubeMonitor->user_id = $authUser->id;

        $youtubeMonitor->save();

        $youtubeMonitor->load('googleAnalyticsProperty');

        return ['youtube_monitor' => $youtubeMonitor];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\YoutubeMonitor  $youtubeMonitor
     * @return \Illuminate\Http\Response
     */
    public function update(YoutubeMonitorRequest $request, YoutubeMonitor $youtubeMonitor)
    {
        $youtubeMonitor->fill($request->validated());
        $youtubeMonitor->save();

        return ['youtube_monitor' => $youtubeMonitor];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\YoutubeMonitor  $youtubeMonitor
     * @return \Illuminate\Http\Response
     */
    public function destroy(YoutubeMonitor $youtubeMonitor)
    {
        YoutubeAnnotation::where('monitor_id', $youtubeMonitor->id)->delete();
        $youtubeMonitor->delete();
        return ['success' => true];
    }


    public function youtubeUrl (Request $req) {

        $userID = Auth::user()->id;
        $url = $req->collectionViewUrl;
        $name = $req->collectionName;
        $gaPropertyId = $req->gaPropertyId;
        $feedUrl = $req->feedUrl;

        $exist = YoutubeMonitor::where('url', $url)->where('user_id', $userID)->first();

        if(!$exist) {
            $monitor = new YoutubeMonitor();

            $monitor->name = $name;
            $monitor->url = $url;
            $monitor->feed_url = $feedUrl;
            $monitor->user_id = $userID;
            $monitor->ga_property_id = $gaPropertyId;
            $monitor->save();
        }

        $youtubeService = new YoutubeService();
        $data = $youtubeService->saveYoutubeAnnotations($feedUrl, $url, $userID);
        return $data;
    }


    public function getYoutubeData (Request $req) {

        $apiKey = config('services.youtube_monitor.data_api_key');
        $url = "https://www.googleapis.com/youtube/v3/videos?id=" . $req->search . "&key=" . $apiKey . "&part=snippet,contentDetails,statistics,status";

        $response = Http::get($url);

        // let sr = [];
        //     for (const item of result.data?.results) {
        //         sr.push({
        //             previewImage: item.artworkUrl600 || item.artworkUrl100,
        //             collectionName: item.collectionName,
        //             collectionId: item.collectionId,
        //             feedUrl: item.feedUrl,
        //             collectionViewUrl: item.collectionViewUrl,
        //             trackCount: item.trackCount,
        //             gaPropertyId: props.gaPropertyId || null,
        //         });
        //     }

        return ['success' => true, 'response' => $response];

    }

}
