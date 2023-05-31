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
        $token = "EAALLZCc2K3swBAHWv7XaLYcnZAODXgBmcYfjSlUmbsuaWxbg0R8j5MEPZBbbul9S0JkiyumNssPzJqyL22g1SpdpxZAM7Yuv3ZBtVgMaWiRZAm9xvz8g2GkF5NsDDd5ZAGkZBRZBvz9ZCNRpeNur2USRy2uYlZCOCbq0Hse8GdLMWFgCJRuKXgzdxOQWoHZBLj9daciCfCG9BVC6CBRBcdbMLuUb";
        $res = $this->getFacebookPages($token);
        dd($res);
//        $test = (new \App\Repositories\FacebookAutomationRepository)->setupFacebookAccount($token, null, '123', 'em@em.com', 'url here', 'Ameer Hamza');
//        dd($test);
    }

    public function getFacebookPages($user_token)
    {
        try {

            $this->facebook->getDefaultAccessToken();
            $response = $this->facebook->get('/me/accounts', $user_token);
            $response->decodeBody();
            $data_array = $response->getDecodedBody();
            if (isset($data_array['data'])) {
                if (isset($data_array['data'])) {
                    return $data_array['data'];
                }
            } else {
                return false;
            }
        } catch (FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * @param $user_token
     * @param $page_id
     * @return array
     */
    public function getFacebookPagePosts($user_token, $page_id): array
    {
        try {



            $page_token = $this->getPageAccessTokenByUserToken($page_id, $user_token);
            $page_posts_response = $this->facebook->get($page_id . '/feed?fields=message,created_time,from,shares,likes.limit(0).summary(true),comments.limit(0).summary(true),attachments', $page_token);
            $page_posts_response_obj = $page_posts_response;
            $page_posts_response_obj->decodeBody();
            $page_posts_data_array = $page_posts_response_obj->getDecodedBody();


            return [
                'status' => true,
                'page_posts' => $page_posts_data_array['data'] ?? [],
                'page_token' => $page_token,
            ];
        } catch (FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getPageAccessTokenByUserToken($page_id, $user_token)
    {
        try {



            $page_token_response = $this->facebook->get($page_id . '?fields=access_token', $user_token);
            $response = $page_token_response;
            $response->decodeBody();
            $data_array = $response->getDecodedBody();
            $page_token = $data_array['access_token'] ?? false;
            return $page_token;
        } catch (FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * @param $post_id
     * @param $page_token
     * @return array
     */
    public function getPagePostImpressions($post_id, $page_token): array
    {
        try {

        


            $post_impressions = $this->facebook->get($post_id . '/insights/post_impressions', $page_token);
            return [
                'status' => true,
                'post_impressions' => @$post_impressions->getDecodedBody()['data'][0]['values'][0]['value'],
            ];
        } catch (FacebookResponseException $e) {
            // When Graph returns an error
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (FacebookSDKException $e) {
            // When validation fails or other local issues
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    // public function getRefreshToken($user_token)
    // {
    //     $response = $this->facebook->get('/oauth/access_token?grant_type=fb_exchange_token&fb_exchange_token='.$user_token, $user_token);
    //     info('refresh token response');
    //     info(print_r($response, 1));
    // }

}
