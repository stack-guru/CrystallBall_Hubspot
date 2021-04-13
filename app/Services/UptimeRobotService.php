<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class UptimeRobotService
{
    /**
     * Initialize the library in your constructor using
     * your environment, api key, and password
     */
    public function __construct()
    {
       
    }

    public function getAccountDetails()
    // {
    //     $request = new HttpRequest();
    //     $request->setUrl('https://api.uptimerobot.com/v2/getAccountDetails');
    //     $request->setMethod(HTTP_METH_POST);
    //     $request->setHeaders(array(
    //         'content-type' => 'application/x-www-form-urlencoded',
    //         'cache-control' => 'no-cache'
    //     ));
                
    //     $request->setContentType('application/x-www-form-urlencoded');
    //     $request->setPostFields(array(
    //         'api_key' => 'u1269638-15f518a7310480e74cc52037',
    //         'format' => 'json'
    //     ));
                
    //     try {
    //         $response = $request->send();
    //         echo $response->getBody();
    //     } catch (HttpException $ex) {
    //         echo $ex;
    //     }
    }

    public function getMonitors()
    {
        // $request = new HttpRequest();
        // $request->setUrl('https://api.uptimerobot.com/v2/getMonitors');
        // $request->setMethod(HTTP_METH_POST);
                
        // $request->setHeaders(array(
        // 'cache-control' => 'no-cache',
        // 'content-type' => 'application/x-www-form-urlencoded'
        // ));
                
        // $request->setContentType('application/x-www-form-urlencoded');
        // $request->setPostFields(array(
        // 'api_key' => 'u1269638-15f518a7310480e74cc52037',
        // 'format' => 'json',
        // 'logs' => '1'
        // ));
                
        // try {
        // $response = $request->send();
                
        // echo $response->getBody();
        // } 
        // catch (HttpException $ex) {
        // echo $ex;
        // }
        
    }
    
    public function newMonitors()
    {
        
    }

    public function deleteMonitors()
    {
        
    }   

}