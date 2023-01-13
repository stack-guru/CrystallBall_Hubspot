<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShopifyMonitorRequest;
use Illuminate\Http\Request;
use App\Models\ShopifyAnnotation;
use App\Models\ShopifyMonitor;
use App\Services\ShopifyService;
use Illuminate\Support\Facades\Auth;

use Goutte\Client;


class ShopifyMonitorController extends Controller
{


    public function index(Request $request)
    {
        if ($request->query('ga_property_id') !== "null") {
            return ['shopify_monitors' => ShopifyMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->where('ga_property_id', $request->query('ga_property_id'))->get()];
        }
        return ['shopify_monitors' => ShopifyMonitor::ofCurrentUser()->with('googleAnalyticsProperty')->get()];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ShopifyMonitorRequest $request)
    {

        $authUser = Auth::user();
        $pricePlan = $authUser->pricePlan;
        $shopifyCount = ShopifyMonitor::ofCurrentUser()->count();

        if ($pricePlan->shopify_monitor_count <= $shopifyCount) {
            return response()->json(['message' => 'Maximum number of monitors limit reached'], 402);
        }

        if (ShopifyMonitor::where('url', $request->url)->ofCurrentUser()->count()) {
            return response()->json(['message' => 'We already have this monitor setup.'], 402);
        }

        $shopifyMonitor = new ShopifyMonitor;
        $shopifyMonitor->fill($request->validated());
        $shopifyMonitor->user_id = $authUser->id;

        $shopifyMonitor->save();

        $shopifyMonitor->load('googleAnalyticsProperty');

        return ['shopify_monitor' => $shopifyMonitor];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ShopifyMonitor  $shopifyMonitor
     * @return \Illuminate\Http\Response
     */
    public function update(ShopifyMonitorRequest $request, ShopifyMonitor $shopifyMonitor)
    {
        $shopifyMonitor->fill($request->validated());
        $shopifyMonitor->save();

        return ['shopify_monitor' => $shopifyMonitor];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ShopifyMonitor  $shopifyMonitor
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShopifyMonitor $shopifyMonitor)
    {

        $shopifyMonitor->delete();

        return ['success' => true];
    }


    public function shopifyUrl (Request $req) {

        $userID = Auth::user()->id;
        $url = $req->shopifyUrl;
        $gaPropertyId = $req->gaPropertyId;

        $exist = ShopifyMonitor::where('url', $url)->where('user_id', $userID)->first();

        if(!$exist) {
            $monitor = new ShopifyMonitor();
            $monitor->url = $url;
            $monitor->user_id = $userID;
            $monitor->ga_property_id = $gaPropertyId;
            $monitor->save();
        }

        $shopifyService = new ShopifyService();
        $data = $shopifyService->saveShopifyProducts($url, $userID);
        return $data;
    }

}