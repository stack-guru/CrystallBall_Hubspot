<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentDetail;
use App\Models\PricePlanSubscription;
use Illuminate\Http\Request;

class PaymentDetailsController extends Controller
{
    public function paymentHistory(){
        $pricePlanSubscriptions = PricePlanSubscription::with(['paymentDetail', 'user', 'pricePlan'])->orderBy('created_at', 'DESC')->get();
        return view('admin/payment-history/index')->with('pricePlanSubscriptions', $pricePlanSubscriptions);
    }

}

