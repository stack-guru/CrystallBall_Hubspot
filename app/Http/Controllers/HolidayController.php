<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    //

    public function holidayApi(){
        $countries=Holiday::select('country_name')->orderBy('country_name','ASC')->distinct()->get()->pluck('country_name');
        return ['countries'=>$countries];
    }
}
