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
        $token = "IGQVJYZAmtwRTJUZADRNcVBjR1hRNHJkd2lWWHliYUZAJNmxsdVItOU9JVnlQUWlHMGpBdy1uUG1WS04wUlJWMUtOQUZAZAdk5oWXZAqbnJ0MTdCcEpWc0IyWElpck93ZATNQd281czVaeDVkSXV0V29QTzdEajI1QWZAnUktkaE9z";
        $client = new Client();


        // Get user info
        $response = $client->request('GET', "https://graph.facebook.com/v1/media/18012252283410989/likes??access_token={$token}");

        $content = $response->getBody()->getContents();
        $oAuth = json_decode($content);

        dd($oAuth);

    }

}
