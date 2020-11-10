<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentDetail;
use App\Models\PricePlanSubscription;
use Illuminate\Http\Request;

class PaymentDetailsController extends Controller
{
    //
    public function paymentHistory(){
        $data['payments']=PaymentDetail::with(['user'])->orderBy('created_at', 'DESC')->get();
//        dd($data);
        return view('admin/payment-history/index',$data);
    }

}

