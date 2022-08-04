<?php

namespace App\Repositories;

use App\Models\UserFacebookAccount;
use App\Services\FacebookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FacebookAutomationRepository
{
    protected $facebookService;

    public function __construct()
    {
        $this->facebookService = new FacebookService();
    }

    /**
     * @param $fb_account_id
     * @param $user_facebook_accounts
     * @return bool
     */
    public function userFacebookAccountExistsByFacebookAccountId($fb_account_id, $user_facebook_accounts): bool
    {
        foreach ($user_facebook_accounts as $user_facebook_account){
            if ($user_facebook_account->facebook_account_id == $fb_account_id){
                return true;
            }
        }
        return false;
    }

    /**
     * @param $token
     * @param $expiresIn
     * @param $id
     * @param $email
     * @param $avatar
     */
    public function setupFacebookAccount($user_token, $expiresIn, $facebook_account_id, $email, $avatar, $name)
    {
        if ($this->userFacebookAccountExistsByFacebookAccountId($facebook_account_id, \auth()->user()->facebook_accounts)){
        }
        else{
            // store account
            $user_facebook_account = $this->storeFacebookAccount($user_token, $expiresIn, $facebook_account_id, $email, $avatar, $name); // returns obj
            if ($user_facebook_account){
                // store facebook pages
                $user_facebook_pages_stored = $this->storeFacebookPages($user_token, $user_facebook_account->id);
            }
        }
    }

    /**
     * @param $token
     * @param $expiresIn
     * @param $id
     * @param $email
     * @param $avatar
     * @return UserFacebookAccount|false
     */
    public function storeFacebookAccount($token, $expiresIn, $facebook_account_id, $email, $avatar, $name){
        $user_facebook_account = new UserFacebookAccount(); // creating new account
        $user_facebook_account->user_id = \auth()->user()->id;
        $user_facebook_account->name = $name;
        $user_facebook_account->token = $token;
        $user_facebook_account->token_expires_at = $expiresIn;
        $user_facebook_account->facebook_account_id = $facebook_account_id;
        $user_facebook_account->facebook_user_email = $email;
        $user_facebook_account->facebook_avatar_url = $avatar;
        if ($user_facebook_account->save()){
            return $user_facebook_account;
        }
        else{
            return false;
        }
    }

    /**
     * @param $token
     */
    public function storeFacebookPages($user_token, $user_facebook_account_id){
        $response = $this->facebookService->getFacebookPages($user_token);
        if(isset($response['response'])){
            $response = $response['response'];
            $response->decodeBody();
            $data_array = $response->getDecodedBody();
            if(isset($data_array['data'])){
                foreach($data_array['data'] as $data){
                    if (isset($data['access_token']) && isset($data['name']) && isset($data['id'])) {
                        $page_access_token = $data['access_token'];
                        $page_name = $data['name'];
                        $page_id = $data['id'];

                        $user_facebook_page = new \App\Models\UserFacebookPage();
                        $user_facebook_page->user_facebook_account_id = $user_facebook_account_id;
                        $user_facebook_page->facebook_page_name = $page_name;
                        $user_facebook_page->facebook_page_id = $page_id;
                        $user_facebook_page->page_access_token = $page_access_token;
                        $user_facebook_page->save();

                        $this->storeFacebookPagePosts($user_token, $page_id, $user_facebook_page->id);
                    }
                }
            }
            
            
        }
    }

    public function storeFacebookPagePosts($user_token, $page_id, $user_facebook_page_id)
    {
        $response = $this->facebookService->getFacebookPagePosts($user_token, $page_id);
        if(isset($response['page_posts'])){
            $page_posts = $response['page_posts'];
            foreach ($page_posts as $post) {
                $title = $post['attachments']['data'][0]['title'] ?? '';
                $description = $post['attachments']['data'][0]['description'] ?? '';
                $shares = $post['shares']['count'] ?? 0;
                $likes = $post['likes']['summary']['total_count'] ?? 0;
                $comments = $post['comments']['summary']['total_count'] ?? 0;
                $url = $post['attachments']['data'][0]['url'] ?? null;

                $page_post_impressions = $this->facebookService->getPagePostImpressions($post['id'], $response['page_token']);

                $facebook_page_post = new \App\Models\UserFacebookPagePost();
                $facebook_page_post->title = $title;
                $facebook_page_post->user_facebook_page_id = $user_facebook_page_id;
                $facebook_page_post->description = $description;
                $facebook_page_post->post_url = $url;
                $facebook_page_post->facebook_post_id = $post['id'] ?? '';
                $facebook_page_post->views_count = $page_post_impressions['post_impressions'] ?? null;
                $facebook_page_post->likes_count = (int)$likes;
                $facebook_page_post->comments_count = (int)$comments;
                $facebook_page_post->shares_count = (int)$shares;
                $facebook_page_post->save();
            }
        }
    }

    /*
     * Check if user has facebook accounts exists
     * */
    /**
     * @return JsonResponse
     */
    public function userFacebookAccountsExists(): JsonResponse
    {
        $user_facebook_accounts = \auth()->user()->facebook_accounts;
        if ($user_facebook_accounts->count() > 0){
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
