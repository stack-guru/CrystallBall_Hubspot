<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricePlanSubscription;

class PricePlanSubscriptionController extends Controller
{
    public function index()
    {
        $pricePlanSubscriptions = PricePlanSubscription::with(['paymentDetail', 'user', 'pricePlan'])->orderBy('created_at', 'DESC')->get();
        return view('admin/payment-detail/index')->with('pricePlanSubscriptions', $pricePlanSubscriptions);
    }

    public function show(PricePlanSubscription $pricePlanSubscription)
    {
        $pricePlanSubscription->load(['paymentDetail', 'coupon', 'user', 'pricePlan']);
        return view('admin/payment-detail/show')->with('pricePlanSubscription', $pricePlanSubscription);
    }
}
