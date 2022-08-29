<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class InstagramAutomationController extends Controller
{

    public function setupInstagramAutomation()
    {
        
    }

    public function userInstagramAccountsExists(Request $request)
    {
        $instagram_accounts = \auth()->user()->instagram_accounts;
        if ($instagram_accounts->count() > 0){
            $exists = true;
        }
        else{
            $exists = false;
        }
        return response()->json([
            'exists' => $exists
        ]);
    }
    
}
