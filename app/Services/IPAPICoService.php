<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class IPAPICoService
{
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    
    // public function __construct()
    // {
        
    // }

    public function getUserDetails($ip)
    {
        $response = Http::get('https://ipapi.co/'.$ip.'/json');
        return $response->json();
    }

}
