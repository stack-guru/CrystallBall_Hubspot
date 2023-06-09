<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShopifyMonitorRequest;
use App\Models\ShopifyMonitor;
use App\Services\ShopifyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ShopifyMonitorController extends Controller
{


    public function index(Request $request)
    {
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
            return response()->json(['message' => 'Maximum number of monitors limit reached'], 422);
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

    public function saveShopifyProducts (Request $req) {

        $userID = Auth::user()->id;
        $url = $req->shopifyUrl;

        // if($monitor) {
        //     return response()->json(['success' => false, 'message' => 'You already have this store url setup.'], 402);
        // }

        $shopifyService = new ShopifyService();
        $products = $shopifyService->getShopifyProducts($url);
        if(!$products) {
            return response()->json(['success' => false, 'message' => 'Please provide the valid store url'], 400);
        }

        $gaPropertyID = $req->gaPropertyId;

        $monitor = ShopifyMonitor::where('url', $url)
            ->where('user_id', $userID)
            ->where('ga_property_id', $gaPropertyID)
            ->first();
        if(!$monitor) {
            $monitor = new ShopifyMonitor();
            $monitor->url = $url;
            $monitor->user_id = $userID;
        }
        $monitor->ga_property_id = $gaPropertyID;
        $monitor->events = $req->events;
        $monitor->save();

        $shopifyService = new ShopifyService();
        $shopifyService->saveShopifyProducts(json_decode($req->events), $products, $userID, $monitor->id);

        return response()->json(['success' => true], 200);

    }

}
