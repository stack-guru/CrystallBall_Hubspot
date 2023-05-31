<?php

namespace App\Http\Controllers\Spectator;

use App\Models\PaymentDetail;
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
        return view('spectator/payment-detail/index')->with('paymentDetails', $paymentDetails);
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
