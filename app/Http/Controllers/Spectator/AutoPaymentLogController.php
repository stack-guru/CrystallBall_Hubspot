<?php

namespace App\Http\Controllers\Spectator;

use App\Http\Controllers\Controller;
use App\Models\AutoPaymentLog;

class AutoPaymentLogController extends Controller {
    public function index(){
        $autoPaymentLogs = AutoPaymentLog::with(['user', 'paymentDetail', 'pricePlanSubscription', 'pricePlan'])->orderBy('created_at', 'DESC')->get();
        return view('spectator/auto-payment-logs/index')->with('autoPaymentLogs', $autoPaymentLogs);
    }
}