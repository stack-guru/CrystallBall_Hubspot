<?php

namespace App\Services;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use GuzzleHttp\Client;

class InstagramService
{

    /**
     * @throws FacebookSDKException
     */
    public function __construct()
    {
    }

    public function test()
    {
        $token = "IGQVJXQ1RvSlUyVmM5ckNNbk5qTnl4WjY3azMxaWllT2RpbUo5b1ktbUZAMMEliVDJCbktXdWxVbGdpZADA1Wm9aeVZAsaHA1NkUxMDdTZAFlqSGV4THdJSGVDOXVkd3JrbUw5MGd3eGlPTXdSZAVpLZA29tMF9DRVhKWnV6bmE4";
        $client = new Client();


        // Get user info
        // $response = $client->request('GET', "https://graph.instagram.com/5344822885587488/media?access_token={$token}");
        $response = $client->request('GET', "https://graph.instagram.com/18012252283410989?access_token={$token}");

        $content = $response->getBody()->getContents();
        $oAuth = json_decode($content);

        dd($oAuth);

    }

}
