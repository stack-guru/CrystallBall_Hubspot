<?php

namespace App\Http\Controllers;

use App\Models\InstagramAccount;
use App\Models\InstagramPost;
use App\Services\InstagramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InstagramAccountController extends Controller
{

        /**
     * @param $token
     * @param $expiresIn
     * @param $id
     * @param $email
     * @param $avatar
     */
    public function setupInstagramAccount($user_token)
    {

        $user_accounts = Auth::user()->facebook_accounts;
        foreach($user_accounts as $user_account){
            $account_pages = $user_account->pages;
            foreach($account_pages as $account_page){
                $instagram_account = $this->getInstagramAccount($account_page->page_access_token, $account_page->facebook_page_id);
                if($instagram_account['account_exists']){
                    
                    $instagram_account_create = InstagramAccount::updateOrCreate(
                        [
                            'user_id' => Auth::id(),
                            'user_facebook_page_id' => $account_page->id,
                        ],
                        [
                            'user_id' => Auth::id(),
                            'user_facebook_page_id' => $account_page->id,
                            'token' => $account_page->page_access_token,
                            'name' => @$instagram_account['name'],
                            'instagram_account_id' => @$instagram_account['instagram_account_id'],
                            'instagram_user_email' => @$instagram_account['instagram_user_email'],
                            'instagram_avatar_url' => @$instagram_account['instagram_avatar_url'],
                        ]
                    );

                    $instagram_posts = $this->getInstagramAccountPosts($account_page->page_access_token, @$instagram_account['instagram_account_id']);
                    
                    foreach($instagram_posts as $instagram_post){
                        InstagramPost::updateOrCreate(
                            [
                                'instagram_account_id' => $instagram_account_create->id,
                                'instagram_post_id' => @$instagram_post['id'],
                            ],
                            [
                                'instagram_account_id' => $instagram_account_create->id,
                                'instagram_post_id' => @$instagram_post['id'],
                                'title' => @$instagram_post['title'],
                                'description' => @$instagram_post['description'],
                                'post_url' => @$instagram_post['post_url'],
                                'views_count' => @$instagram_post['views_count'] ?? 0,
                                'likes_count' => @$instagram_post['likes_count'] ?? 0,
                                'comments_count' => @$instagram_post['comments_count'] ?? 0,
                                'shares_count' => @$instagram_post['shares_count'] ?? 0,
                            ]
                        );
                        
                    }

                }
                
            }
        }

    }

    public function getInstagramAccount($page_access_token, $page_id)
    {
        $service = new InstagramService();

        $response = $service->getInstagramAccount($page_access_token, $page_id);

        return [
            'name' => @$response['name'],
            'instagram_account_id' => @$response['instagram_account_id'],
            'instagram_user_email' => @$response['instagram_user_email'],
            'instagram_avatar_url' => @$response['instagram_avatar_url'],
            'account_exists' => (boolean)@$response['account_exists'],
        ];

    }

    public function getInstagramAccountPosts($page_access_token, $instagram_account_id)
    {
        $service = new InstagramService();

        $response = $service->getInstagramPosts($page_access_token, $instagram_account_id);
        $posts = [];

        foreach ($response as $post) {
            $post_data = [
                'id' => @$post['id'],
                'title' => '',
                'description' => @$post['caption'],
                'post_url' => @$post['permalink'],
                'views_count' => @$post['insights']['data'][0]['values'][0]['value'] ?? 0,
                'likes_count' => @$post['like_count'] ?? 0,
                'comments_count' => @$post['comments_count'] ?? 0,
                'shares_count' => 0,
            ];
            array_push($posts, $post_data);
        }

        return $posts;
    }

}
