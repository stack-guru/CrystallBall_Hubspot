<?php

namespace App\Services;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;

class FacebookService
{
    private $facebook;

    /**
     * @throws FacebookSDKException
     */
    public function __construct()
    {
        $this->facebook = new Facebook([
//            'app_id' => env('FB_APP_ID'),
//            'app_secret' => env('FB_APP_SECRET'),
            'default_graph_version' => 'v2.10',
        ]);
    }

    public function test()
    {

        // page id 111145971667083
        try {
            // Get the \Facebook\GraphNodes\GraphUser object for the current user.
            // If you provided a 'default_access_token', the '{access-token}' is optional.
            $response = $this->facebook->get('/111145971667083/feed', '');
            dd($response);
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(FacebookSDKException $e) {
            // When validation fails or other local issues
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }
    }

}
