<?php

namespace App\Repositories;

use App\Models\FacebookTrackingAnnotation;
use App\Models\FacebookTrackingConfiguration;
use App\Models\User;
use App\Models\UserFacebookAccount;
use App\Models\UserFacebookPage;
use App\Models\UserFacebookPagePost;
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
        $user_facebook_account = $this->storeFacebookAccount($user_token, $expiresIn, $facebook_account_id, $email, $avatar, $name); // returns obj
        if ($user_facebook_account){
            // store facebook pages and posts
            $this->storeFacebookPages($user_token, $user_facebook_account->id);
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
        $user_facebook_account = UserFacebookAccount::where('facebook_account_id', $facebook_account_id)->where('user_id', \auth()->user()->id)->first();
        if($user_facebook_account){
            $user_facebook_account->token = $token;
            $user_facebook_account->token_expires_at = $expiresIn;
            $user_facebook_account->facebook_user_email = $email;
            $user_facebook_account->facebook_avatar_url = $avatar;
        }
        else{
            $user_facebook_account = new UserFacebookAccount();
            $user_facebook_account->user_id = \auth()->user()->id;
            $user_facebook_account->name = $name;
            $user_facebook_account->token = $token;
            $user_facebook_account->token_expires_at = $expiresIn;
            $user_facebook_account->facebook_account_id = $facebook_account_id;
            $user_facebook_account->facebook_user_email = $email;
            $user_facebook_account->facebook_avatar_url = $avatar;
        }
        
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
        $data_array = $this->facebookService->getFacebookPages($user_token);
        foreach ($data_array as $data) {
            if (isset($data['access_token']) && isset($data['name']) && isset($data['id'])) {
                $page_access_token = $data['access_token'];
                $page_name = $data['name'];
                $page_id = $data['id'];

                $user_facebook_page = UserFacebookPage::where('facebook_page_id', $page_id)->where('user_facebook_account_id', $user_facebook_account_id)->first();
                if ($user_facebook_page) {
                    $user_facebook_page->facebook_page_name = $page_name;
                    $user_facebook_page->page_access_token = $page_access_token;
                } else {
                    $user_facebook_page = new \App\Models\UserFacebookPage();
                    $user_facebook_page->user_facebook_account_id = $user_facebook_account_id;
                    $user_facebook_page->facebook_page_name = $page_name;
                    $user_facebook_page->facebook_page_id = $page_id;
                    $user_facebook_page->page_access_token = $page_access_token;
                }
                $user_facebook_page->save();
                $this->storeFacebookPagePosts($user_token, $page_id, $user_facebook_page->id);
            }
        }

    }

    public function storeFacebookPagePosts($user_token, $page_id, $user_facebook_page_id)
    {
        $response = $this->facebookService->getFacebookPagePosts($user_token, $page_id);
        if ($response['status']) {
            foreach ($response['page_posts'] as $post) {
                $title = $post['attachments']['data'][0]['title'] ?? '';
                $description = $post['attachments']['data'][0]['description'] ?? '';
                $shares = $post['shares']['count'] ?? 0;
                $likes = $post['likes']['summary']['total_count'] ?? 0;
                $comments = $post['comments']['summary']['total_count'] ?? 0;
                $url = $post['attachments']['data'][0]['url'] ?? null;

                $page_post_impressions = $this->facebookService->getPagePostImpressions($post['id'], $response['page_token']);

                $facebook_page_post = UserFacebookPagePost::where('facebook_post_id', @$post['id'])->where('user_facebook_page_id', $user_facebook_page_id)->first();
                if ($facebook_page_post) {
                    $facebook_page_post->title = $title;
                    $facebook_page_post->description = $description;
                    $facebook_page_post->post_url = $url;
                    $facebook_page_post->views_count = $page_post_impressions['post_impressions'] ?? null;
                    $facebook_page_post->likes_count = (int)$likes;
                    $facebook_page_post->comments_count = (int)$comments;
                    $facebook_page_post->shares_count = (int)$shares;
                } else {
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
                }
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


    public function handleFacebookAutomation()
    {

        // get all ga users whose fb automation is on
        $users = User::where('is_ds_facebook_tracking_enabled', true)->get();
        // get fb configurations of each user
        foreach ($users as $user) {

            // get user facebook automation configurations
            $configuraion = FacebookTrackingConfiguration::where('user_id', $user->id)->first();

            // get all fb accounts
            $facebook_accounts = $user->facebook_accounts;
            info('Facebook account :: ');
            info(print_r($facebook_accounts,1));
            foreach ($facebook_accounts as $facebook_account) {

                // get all fb account pages from database
                $facebook_pages_from_database = $facebook_account->pages;

                // get all fb account pages from facebook
                $facebook_pages_from_facebook = $this->facebookService->getFacebookPages($facebook_account->token);
                info('Facebook pages from facebook :: ');
                info(print_r($facebook_pages_from_facebook,1));
                info('Facebook pages from database :: ');
                info(print_r($facebook_pages_from_database,1));

                if ($facebook_pages_from_facebook){
                    foreach ($facebook_pages_from_facebook as $facebook_page_from_facebook) {

                        foreach ($facebook_pages_from_database as $facebook_page_from_database) {

                            if ($facebook_page_from_facebook['id'] == $facebook_page_from_database->facebook_page_id) {
                                // get page posts from facebook
                                $response = $this->facebookService->getFacebookPagePosts($facebook_account->token, $facebook_page_from_database->facebook_page_id);
                                info('Facebook page posts from facebook :: ');
                                info(print_r($response, 1));
                                // get page posts from database
                                $facebook_page_posts_from_database = $facebook_page_from_database->posts;

                                if ($response['status']) {

                                    // check if there is a new post
                                    if ((int)count($response['page_posts']) > (int)$facebook_page_posts_from_database->count()) {
                                        // check configuration if it's enabled to create annotation
                                        if ($configuraion->when_new_post_on_facebook) {
                                            $data = @$response['page_posts'][0]['attachments']['data'][0];
                                            $this->createAutomationAnnotation('when_new_post_on_facebook', $user, $data);
                                        }
                                    }

                                    // check if there is any change in post in our local db with respect to facebook response
                                    foreach ($response['page_posts'] as $facebook_page_post_from_facebook) {

                                        foreach ($facebook_page_posts_from_database as $facebook_page_post_from_database) {

                                            if ($facebook_page_post_from_facebook['id'] == $facebook_page_post_from_database->facebook_post_id){

                                                $likes_fb = (int)@$facebook_page_post_from_facebook['likes']['summary']['total_count'];
                                                $likes_db = (int)$facebook_page_post_from_database->likes_count;

                                                $comments_fb = (int)@$facebook_page_post_from_facebook['comments']['summary']['total_count'];
                                                $comments_db = (int)$facebook_page_post_from_database->comments_count;

                                                $shares_fb = (int)@$facebook_page_post_from_facebook['shares']['count'];
                                                $shares_db = (int)$facebook_page_post_from_database->shares_count;

                                                $views_fb = (int)$this->facebookService->getPagePostImpressions($facebook_page_post_from_facebook['id'], $response['page_token'])['post_impressions'];
                                                $views_db = (int)$facebook_page_post_from_database->views_count;

                                                if ($configuraion->is_post_likes_tracking_on){
                                                    $when_post_reach_likes = $configuraion->when_post_reach_likes;
                                                    if ($likes_fb > $likes_db){
                                                        if ($likes_fb >= $when_post_reach_likes){
                                                            $data = [
                                                                "likes" => $likes_fb,
                                                                "url" => @$facebook_page_post_from_facebook['attachments']['data'][0]['url']
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_likes', $user, $data);
                                                        }
                                                    }
                                                }

                                                if ($configuraion->is_post_comments_tracking_on){
                                                    $when_post_reach_comments = $configuraion->when_post_reach_comments;
                                                    if ($comments_fb > $comments_db){
                                                        if ($comments_fb >= $when_post_reach_comments){
                                                            $data = [
                                                                "comments" => $comments_fb,
                                                                "url" => @$facebook_page_post_from_facebook['attachments']['data'][0]['url']
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_comments', $user, $data);
                                                        }
                                                    }
                                                }

                                                if ($configuraion->is_post_views_tracking_on){
                                                    $when_post_reach_views = $configuraion->when_post_reach_views;
                                                    if ($views_fb > $views_db){
                                                        if ($views_fb >= $when_post_reach_views){
                                                            $data = [
                                                                "views" => $views_fb,
                                                                "url" => @$facebook_page_post_from_facebook['attachments']['data'][0]['url']
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_views', $user, $data);
                                                        }
                                                    }
                                                }

                                                if ($configuraion->is_post_shares_tracking_on){
                                                    $when_post_reach_shares = $configuraion->when_post_reach_shares;
                                                    if ($shares_fb > $shares_db){
                                                        if ($shares_fb >= $when_post_reach_shares){
                                                            $data = [
                                                                "shares" => $shares_fb,
                                                                "url" => @$facebook_page_post_from_facebook['attachments']['data'][0]['url']
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_shares', $user, $data);
                                                        }
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }

                $this->updateFacebookAccountData($facebook_account);

            }
        }
    }

    public function createAutomationAnnotation($type, $user, $data)
    {
        switch ($type){
            case 'when_new_post_on_facebook':
                $description = "A new post on facebook page. </br> View post:  </br>" . @$data['url'];
                FacebookTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Facebook',
                    'event_type' => 'Alert',
                    'event_name' => 'New Post',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_likes':
                $description = "A post on facebook reached ".@$data['likes']." likes. </br> View post:  </br>" . @$data['url'];
                FacebookTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Facebook',
                    'event_type' => 'Alert',
                    'event_name' => 'Likes Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_comments':
                $description = "A post on facebook reached ".@$data['comments']." comments. </br> View post:  </br>" . @$data['url'];
                FacebookTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Facebook',
                    'event_type' => 'Alert',
                    'event_name' => 'Comments Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_views':
                $description = "A post on facebook reached ".@$data['views']." views. </br> View post:  </br>" . @$data['url'];
                FacebookTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Facebook',
                    'event_type' => 'Alert',
                    'event_name' => 'Views Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_shares':
                $description = "A post on facebook reached ".@$data['shares']." shares. </br> View post:  </br>" . @$data['url'];
                FacebookTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Facebook',
                    'event_type' => 'Alert',
                    'event_name' => 'Shares Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today()
                ]);
                break;
            default:
                break;
        }
    }

    public function updateFacebookAccountData($facebook_account){
        $this->storeFacebookPages($facebook_account->token, $facebook_account->facebook_account_id);
    }

}
