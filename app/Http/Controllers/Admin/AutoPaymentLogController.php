<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AutoPaymentLog;

class AutoPaymentLogController extends Controller {
    public function index(){
        $autoPaymentLogs = AutoPaymentLog::with(['user', 'paymentDetail', 'pricePlanSubscription', 'pricePlan'])->orderBy('created_at', 'DESC')->get();
        return view('admin/auto-payment-logs/index')->with('autoPaymentLogs', $autoPaymentLogs);
    }
}