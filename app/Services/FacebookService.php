<?php

namespace App\Services;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;

class FacebookService
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
        $token = "EAAF72DdAaSsBAFdPIppPMY2BgjxGsP3WYqO92Av8QJq5pRk5gBG5f3ylNPsRG7Yk4uO5r7FZAtv6gAM4IOgrqpDsqFasztcFhXpLqltIBnJ6vwecYj3jTdR14YiZANoLpDo7HgJItGyPIYpZAWKBGHtHtc0R0im5lNdyi3ql1UDlDehD1aFUuDyHGnCuHcZD";
        // $res = $this->getPagePostImpressions('111145971667083_111161368332210', $token);
        // dd($res);
        $test = (new \App\Repositories\FacebookAutomationRepository)->setupFacebookAccount($token, null, '123', 'em@em.com', 'url here', 'Ameer Hamza');
        dd($test);
    }

    public function getFacebookPages($user_token)
    {
        try {
            $response = $this->facebook->get('/me/accounts', $user_token);
            return [
                'status' => true,
                'response' => $response
            ];
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(\Exception $e){
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getFacebookPagePosts($user_token, $page_id)
    {
        try {
            $page_posts_response = $this->facebook->get($page_id.'/feed?fields=shares,likes.limit(0).summary(true),comments.limit(0).summary(true),attachments', $user_token);
            $page_posts_response_obj = $page_posts_response;
            $page_posts_response_obj->decodeBody();
            $page_posts_data_array = $page_posts_response_obj->getDecodedBody();

            $page_token = $this->getPageAccessTokenByUserToken($page_id, $user_token);

            return [
                'status' => true,
                'page_posts' => $page_posts_data_array['data'] ?? [],
                'page_token' => $page_token,
            ];
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(\Exception $e){
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getPageAccessTokenByUserToken($page_id, $user_token)
    {
        try {
            $page_token_response = $this->facebook->get($page_id.'?fields=access_token', $user_token);
            $response = $page_token_response;
            $response->decodeBody();
            $data_array = $response->getDecodedBody();
            $page_token = $data_array['access_token'] ?? false;
            return $page_token;
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(\Exception $e){
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getPagePostImpressions($post_id, $page_token)
    {
        try {
            $post_impressions = $this->facebook->get($post_id.'/insights/post_impressions', $page_token);

            return [
                'status' => true,
                'post_impressions' => $post_impressions->getDecodedBody()['data'][0]['values'][0]['value'] ?? false,
            ];
        } catch(FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch(\Exception $e){
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

}
