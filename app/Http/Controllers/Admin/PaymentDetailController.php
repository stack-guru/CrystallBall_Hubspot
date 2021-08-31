<?php

namespace App\Http\Controllers\Admin;

use App\Models\PaymentDetail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PaymentDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $paymentDetails = PaymentDetail::with('user')->orderBy('created_at', 'DESC')->get();
        return view('admin/payment-detail/index')->with('paymentDetails', $paymentDetails);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PaymentDetail  $paymentDetail
     * @return \Illuminate\Http\Response
     */
    public function show(PaymentDetail $paymentDetail)
    {
        //
    }

}
