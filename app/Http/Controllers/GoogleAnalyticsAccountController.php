<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Models\GoogleAnalyticsAccount;
use App\Services\GoogleAnalyticsService;

class GoogleAnalyticsAccountController extends Controller
{
    public function index(){
        $gAS = new GoogleAnalyticsService;
        return $gAS->getConnectedAccounts(Auth::user()->googleAccounts()->first());
    }
}
