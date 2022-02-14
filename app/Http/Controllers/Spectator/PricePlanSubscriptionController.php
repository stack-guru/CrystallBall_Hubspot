<?php

namespace App\Http\Controllers\Spectator;

use App\Http\Controllers\Controller;
use App\Models\PricePlanSubscription;

class PricePlanSubscriptionController extends Controller
{
    public function index()
    {
        $pricePlanSubscriptions = PricePlanSubscription::with(['paymentDetail', 'user', 'pricePlan'])->orderBy('created_at', 'DESC')->get();
        return view('spectator/price-plan-subscription/index')->with('pricePlanSubscriptions', $pricePlanSubscriptions);
    }

    public function show(PricePlanSubscription $pricePlanSubscription)
    {
        $pricePlanSubscription->load(['paymentDetail', 'coupon', 'user', 'pricePlan']);
        return view('spectator/price-plan-subscription/show')->with('pricePlanSubscription', $pricePlanSubscription);
    }
}
