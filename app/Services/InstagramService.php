<?php

namespace App\Services;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use GuzzleHttp\Client;

class InstagramService
{

    private $facebook;
    private $token;

    /**
     * @throws FacebookSDKException
     */
    public function __construct()
    {
        $this->facebook = new Facebook([
            'app_id' => config('services.facebook.client_id'),
            'app_secret' => config('services.facebook.client_secret'),
            'default_graph_version' => 'v2.10',
        ]);
    }

    public function test()
    {
        $token = "EAAF72DdAaSsBAB45JCZA4NFhiXJTpH0Wmze67dCVVJHMROqXRQledSF51bZBslkQKv5WgPbq9qjVFONpGmwZAj7JfCHv5lmZC03p8xAUOUleZBeVpdgxdMbczteRTDabx7ZAHUeuFt4pnDSZABdCDJOzanSDyHKjcbMa74pz8wZCfjuBsOo6ihIqjxlkZCCHMgZCLDEKfBvH3cwI7QXyZCJNtW76fKczvzu3EuZCEKFdZCNbclwTAl3C9Jdxs";
        // get facebook page id
        // $response = $this->facebook->get('/me/accounts', $token);

        // get facebook page access token
        // $response = $this->facebook->get('/111145971667083?fields=access_token', $token); // ['access_token']
        $page_access_token = "EAAF72DdAaSsBAD6vZAH6lziW4IsTQM3L3zdN0UOVeyrQDs5hIKZBV3USUXq2ZCTQYVLgBzBfFMZAmAkJdxxHyS08NQw3sj68eARutQL0qisKKW2IC2rRKtAzhw7AgPsQJ4ryEzE9o0tG5vRcJZCiXrTO68ZCEcZAU7rEp8UQPlFAKrSyTZBnZA8RHxMUZA6BED1HOfOf7AwP5eUAZDZD";

        // get instagram account id
        // $response = $this->facebook->get('/111145971667083?fields=instagram_business_account', $token); 
        // $response->decodeBody();

        // get user insights
        // $response = $this->facebook->get('/17841407061239713/insights?metric=impressions&period=days_28', $page_access_token); 
        // $response->decodeBody();

        // get user insights
        // $endpointFormat = '17841407061239713?fields=business_discovery.username({ig-username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}';
        // $endpointFormat = '17841407061239713?fields=like_count,comments_count';

        // get posts
        // $endpointFormat = '17841407061239713?fields=media';

        // get post likes comments
        $endpointFormat = '18012252283410989?fields=like_count,comments_count,permalink';
        // $endpointFormat = '18012252283410989?fields=business_discovery.username({ig-username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}';

        // $response = $this->facebook->get('/17841407061239713/fields=business_discovery.username({ig-username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}', $page_access_token); 
        $response = $this->facebook->get($endpointFormat, $page_access_token); 
        $response->decodeBody();

        $data_array = $response->getDecodedBody();
        dd($data_array);
    }

}
