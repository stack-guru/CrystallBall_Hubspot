<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;


class UptimeRobotServiceController extends Controller
{
    public function index()
    {
       $url= "https://api.uptimerobot.com/v2/getAccountDetails";

       $response = Http::post($url, [
            'api_key' => 'u1269638-15f518a7310480e74cc52037',
          
        ]);

        // $request = new HttpRequest();
        // $request->setUrl('https://api.uptimerobot.com/v2/getAccountDetails');
        // $request->setMethod(HTTP_METH_POST);
        // $request->setHeaders(array(
        //     'content-type' => 'application/x-www-form-urlencoded',
        //     'cache-control' => 'no-cache'
        // ));
                
        // $request->setContentType('application/x-www-form-urlencoded');
        // $request->setPostFields(array(
        //     'api_key' => 'u1269638-15f518a7310480e74cc52037',
        //     'format' => 'json'
        // ));
                
        // try {
        //     $response = $request->send();
        //     echo $response->getBody();
        // } catch (HttpException $ex) {
        //     echo $ex;
        // }
    }
}
