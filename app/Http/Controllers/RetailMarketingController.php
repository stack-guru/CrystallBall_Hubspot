<?php

namespace App\Http\Controllers;

use App\Models\RetailMarketing;
use Illuminate\Http\Request;

class RetailMarketingController extends Controller
{
    public function uiIndex(Request $request)
    {
        $retailMarketingDates = RetailMarketing::select('id', 'event_name', 'show_at')->orderBy('show_at', 'DESC')->distinct()->get();
        return ['retail_marketing_dates' => $retailMarketingDates];
    }
}
