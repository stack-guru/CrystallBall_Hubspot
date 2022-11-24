<?php

namespace App\Repositories;

use App\Models\BitbucketTrackingAnnotation;
use App\Models\BitbucketTrackingConfiguration;
use App\Models\User;
use App\Models\UserBitbucketAccount;
use App\Services\BitbucketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class BitbucketAutomationRepository
{
    protected $bitbucketService;

    public function __construct()
    {
        $this->bitbucketService = new BitbucketService();
    }

    /**
     * @param $bb_account_id
     * @param $user_bitbucket_accounts
     * @return bool
     */
    public function userBitbucketAccountExistsByBitbucketAccountId($bb_account_id, $user_bitbucket_accounts): bool
    {
        foreach ($user_bitbucket_accounts as $user_bitbucket_account) {
            if ($user_bitbucket_account->bitbucket_account_id == $bb_account_id) {
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
    public function setupBitbucketAccount($user_token, $expiresIn, $bitbucket_account_id, $email, $avatar, $name)
    {
        $user_bitbucket_account = $this->storeBitbucketAccount($user_token, $expiresIn, $bitbucket_account_id, $email, $avatar, $name); // returns obj
        if ($user_bitbucket_account) {
            // store Bitbucket pages and posts
            $this->bitbucketService->authenticate($user_bitbucket_account->token);
        }
    }

    public function getWorkspaces()
    {
        try {
            $user_bitbucket_accounts = \auth()->user()->bitbucket_accounts;
            if ($user_bitbucket_accounts->count() > 0) {
                $this->bitbucketService->authenticate($user_bitbucket_accounts[0]->token);
                $workspaces = $this->bitbucketService->getWorkspaces();
            } else {
                $workspaces = [];
            }
        } catch (\Exception $e) {
            dd($e);
        }
        return $workspaces;
    }

    /**
     * @param $token
     * @param $expiresIn
     * @param $id
     * @param $email
     * @param $avatar
     * @return UserBitbucketAccount|false
     */
    public function storeBitbucketAccount($token, $expiresIn, $bitbucket_account_id, $email, $avatar, $name)
    {
        $user_bitbucket_account = UserBitbucketAccount::where('bitbucket_account_id', $bitbucket_account_id)->where('user_id', \auth()->user()->id)->first();
        if ($user_bitbucket_account) {
            $user_bitbucket_account->name = $name;
            $user_bitbucket_account->token = $token;
            $user_bitbucket_account->token_expires_at = $expiresIn;
            $user_bitbucket_account->bitbucket_user_email = $email;
            $user_bitbucket_account->bitbucket_avatar_url = $avatar;
        } else {
            $user_bitbucket_account = new UserBitbucketAccount;
            $user_bitbucket_account->user_id = \auth()->user()->id;
            $user_bitbucket_account->name = $name;
            $user_bitbucket_account->token = $token;
            $user_bitbucket_account->token_expires_at = $expiresIn;
            $user_bitbucket_account->bitbucket_account_id = $bitbucket_account_id;
            $user_bitbucket_account->bitbucket_user_email = $email;
            $user_bitbucket_account->bitbucket_avatar_url = $avatar;
        }

        if ($user_bitbucket_account->save()) {
            return $user_bitbucket_account;
        } else {
            return false;
        }
    }

    /*
     * Check if user has Bitbucket accounts exists
     * */
    /**
     * @return JsonResponse
     */
    public function userBitbucketAccountsExists(): JsonResponse
    {
        try {
            $user_bitbucket_accounts = \auth()->user()->bitbucket_accounts;
            if ($user_bitbucket_accounts->count() > 0) {
                $this->bitbucketService->authenticate($user_bitbucket_accounts[0]->token);

                if ($this->bitbucketService->getCurrentUser()->show()) {
                    $exists = true;
                } else {
                    $exists = false;
                }

            } else {
                $exists = false;
            }
            $error = null;
        } catch (\Exception $e) {
            $exists = false;
            $error = $e->getMessage();
        }
        return response()->json([
            'exists' => $exists,
            'error' => $error,
        ]);
    }

    public function handleBitbucketAutomation()
    {

        // get all ga users whose bb automation is on
        $users = User::where('is_ds_Bitbucket_tracking_enabled', true)->get();
        // get bb configurations of each user
        foreach ($users as $user) {

            // get user Bitbucket automation configurations
            $configuraion = BitbucketTrackingConfiguration::where('user_id', $user->id)->first();

            // get all bb accounts
            $Bitbucket_accounts = $user->Bitbucket_accounts;

            foreach ($Bitbucket_accounts as $Bitbucket_account) {

                // get all bb account pages from database
                $Bitbucket_pages_from_database = $Bitbucket_account->pages;

                // get all bb account pages from Bitbucket
                $Bitbucket_pages_from_Bitbucket = $this->bitbucketService->getBitbucketPages($Bitbucket_account->token);

                if ($Bitbucket_pages_from_Bitbucket) {
                    foreach ($Bitbucket_pages_from_Bitbucket as $Bitbucket_page_from_Bitbucket) {

                        foreach ($Bitbucket_pages_from_database as $Bitbucket_page_from_database) {

                            if ($Bitbucket_page_from_Bitbucket['id'] == $Bitbucket_page_from_database->Bitbucket_page_id) {
                                // get page posts from Bitbucket
                                $response = $this->bitbucketService->getBitbucketPagePosts($Bitbucket_account->token, $Bitbucket_page_from_database->Bitbucket_page_id);
                                // get page posts from database
                                $Bitbucket_page_posts_from_database = $Bitbucket_page_from_database->posts;

                                if ($response['status']) {

                                    // check if there is a new post
                                    if ((int) count($response['page_posts']) > (int) $Bitbucket_page_posts_from_database->count()) {
                                        // check configuration if it's enabled to create annotation
                                        if ($configuraion->when_new_post_on_Bitbucket) {
                                            $data = @$response['page_posts'][0]['attachments']['data'][0];
                                            $this->createAutomationAnnotation('when_new_post_on_Bitbucket', $user, $data);
                                        }
                                    }

                                    // check if there is any change in post in our local db with respect to Bitbucket response
                                    foreach ($response['page_posts'] as $Bitbucket_page_post_from_Bitbucket) {

                                        foreach ($Bitbucket_page_posts_from_database as $Bitbucket_page_post_from_database) {

                                            if ($Bitbucket_page_post_from_Bitbucket['id'] == $Bitbucket_page_post_from_database->Bitbucket_post_id) {

                                                $likes_bb = (int) @$Bitbucket_page_post_from_Bitbucket['likes']['summary']['total_count'];
                                                $likes_db = (int) $Bitbucket_page_post_from_database->likes_count;

                                                $comments_bb = (int) @$Bitbucket_page_post_from_Bitbucket['comments']['summary']['total_count'];
                                                $comments_db = (int) $Bitbucket_page_post_from_database->comments_count;

                                                $shares_bb = (int) @$Bitbucket_page_post_from_Bitbucket['shares']['count'];
                                                $shares_db = (int) $Bitbucket_page_post_from_database->shares_count;

                                                $views_bb = (int) $this->bitbucketService->getPagePostImpressions($Bitbucket_page_post_from_Bitbucket['id'], $response['page_token'])['post_impressions'];
                                                $views_db = (int) $Bitbucket_page_post_from_database->views_count;

                                                if ($configuraion->is_post_likes_tracking_on) {
                                                    $when_post_reach_likes = $configuraion->when_post_reach_likes;
                                                    if ($likes_bb > $likes_db) {
                                                        if ($likes_bb >= $when_post_reach_likes) {
                                                            $data = [
                                                                "likes" => $likes_bb,
                                                                "url" => @$Bitbucket_page_post_from_Bitbucket['attachments']['data'][0]['url'],
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_likes', $user, $data);
                                                        }
                                                    }
                                                }

                                                if ($configuraion->is_post_comments_tracking_on) {
                                                    $when_post_reach_comments = $configuraion->when_post_reach_comments;
                                                    if ($comments_bb > $comments_db) {
                                                        if ($comments_bb >= $when_post_reach_comments) {
                                                            $data = [
                                                                "comments" => $comments_bb,
                                                                "url" => @$Bitbucket_page_post_from_Bitbucket['attachments']['data'][0]['url'],
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_comments', $user, $data);
                                                        }
                                                    }
                                                }

                                                if ($configuraion->is_post_views_tracking_on) {
                                                    $when_post_reach_views = $configuraion->when_post_reach_views;
                                                    if ($views_bb > $views_db) {
                                                        if ($views_bb >= $when_post_reach_views) {
                                                            $data = [
                                                                "views" => $views_bb,
                                                                "url" => @$Bitbucket_page_post_from_Bitbucket['attachments']['data'][0]['url'],
                                                            ];
                                                            $this->createAutomationAnnotation('when_post_reach_views', $user, $data);
                                                        }
                                                    }
                                                }

                                                if ($configuraion->is_post_shares_tracking_on) {
                                                    $when_post_reach_shares = $configuraion->when_post_reach_shares;
                                                    if ($shares_bb > $shares_db) {
                                                        if ($shares_bb >= $when_post_reach_shares) {
                                                            $data = [
                                                                "shares" => $shares_bb,
                                                                "url" => @$Bitbucket_page_post_from_Bitbucket['attachments']['data'][0]['url'],
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

                $this->updateBitbucketAccountData($Bitbucket_account);

            }
        }
    }

    public function createAutomationAnnotation($type, $user, $data)
    {
        switch ($type) {
            case 'when_new_post_on_Bitbucket':
                $description = "A new post on Bitbucket page. </br> View post:  </br>" . @$data['url'];
                BitbucketTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Bitbucket',
                    'event_type' => 'Alert',
                    'event_name' => 'New Post',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today(),
                ]);
                break;
            case 'when_post_reach_likes':
                $description = "A post on Bitbucket reached " . @$data['likes'] . " likes. </br> View post:  </br>" . @$data['url'];
                BitbucketTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Bitbucket',
                    'event_type' => 'Alert',
                    'event_name' => 'Likes Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today(),
                ]);
                break;
            case 'when_post_reach_comments':
                $description = "A post on Bitbucket reached " . @$data['comments'] . " comments. </br> View post:  </br>" . @$data['url'];
                BitbucketTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Bitbucket',
                    'event_type' => 'Alert',
                    'event_name' => 'Comments Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today(),
                ]);
                break;
            case 'when_post_reach_views':
                $description = "A post on Bitbucket reached " . @$data['views'] . " views. </br> View post:  </br>" . @$data['url'];
                BitbucketTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Bitbucket',
                    'event_type' => 'Alert',
                    'event_name' => 'Views Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today(),
                ]);
                break;
            case 'when_post_reach_shares':
                $description = "A post on Bitbucket reached " . @$data['shares'] . " shares. </br> View post:  </br>" . @$data['url'];
                BitbucketTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Bitbucket',
                    'event_type' => 'Alert',
                    'event_name' => 'Shares Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $data['title'] ?? $description,
                    'show_at' => today(),
                ]);
                break;
            default:
                break;
        }
    }

    public function updateBitbucketAccountData($Bitbucket_account)
    {
        $this->storeBitbucketPages($Bitbucket_account->token, $Bitbucket_account->Bitbucket_account_id);
    }

}
