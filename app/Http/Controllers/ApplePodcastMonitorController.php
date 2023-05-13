<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplePodcastMonitorRequest;
use Illuminate\Http\Request;
use App\Models\ApplePodcastAnnotation;
use App\Models\ApplePodcastMonitor;
use App\Services\ApplePodcastService;
use Illuminate\Support\Facades\Auth;

use Goutte\Client;


class ApplePodcastMonitorController extends Controller
{


    public function index(Request $request)
    {
        if ($request->query('ga_property_id') !== "null" && $request->query('ga_property_id')) {
            return ['apple_podcast_monitors' => ApplePodcastMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->where('ga_property_id', $request->query('ga_property_id'))->get()];
        }
        return ['apple_podcast_monitors' => ApplePodcastMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->get()];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ApplePodcastMonitorRequest $request)
    {

        $authUser = Auth::user();
        $pricePlan = $authUser->pricePlan;
        $applePodcastsCount = ApplePodcastMonitor::ofCurrentUser()->count();

        if ($pricePlan->apple_podcast_monitor_count <= $applePodcastsCount) {
            return response()->json(['message' => 'Maximum number of monitors limit reached'], 422);
        }

        if (ApplePodcastMonitor::where('url', $request->url)->ofCurrentUser()->count()) {
            return response()->json(['message' => 'We already have this monitor setup.'], 402);
        }

        $applePodcastMonitor = new ApplePodcastMonitor;
        $applePodcastMonitor->fill($request->validated());
        $applePodcastMonitor->user_id = $authUser->id;

        $applePodcastMonitor->save();

        $applePodcastMonitor->load('googleAnalyticsProperty');

        return ['apple_podcast_monitor' => $applePodcastMonitor];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ApplePodcastMonitor  $applePodcastMonitor
     * @return \Illuminate\Http\Response
     */
    public function update(ApplePodcastMonitorRequest $request, ApplePodcastMonitor $applePodcastMonitor)
    {
        $applePodcastMonitor->fill($request->validated());
        $applePodcastMonitor->save();

        return ['apple_podcast_monitor' => $applePodcastMonitor];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ApplePodcastMonitor  $applePodcastMonitor
     * @return \Illuminate\Http\Response
     */
    public function destroy(ApplePodcastMonitor $applePodcastMonitor)
    {

        $applePodcastMonitor->delete();

        return ['success' => true];
    }


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
