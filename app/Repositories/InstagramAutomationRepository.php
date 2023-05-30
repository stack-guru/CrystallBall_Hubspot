<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\InstagramAccountController;
use App\Models\InstagramTrackingAnnotation;
use App\Models\InstagramTrackingConfiguration;
use App\Services\InstagramService;

class InstagramAutomationRepository
{

    public function handleInstagramAutomation ($userId = null, $confId = null, $forceSave = false) {

        $users = User::where('is_ds_instagram_tracking_enabled', true)
        ->when($userId, function ($q) use ($userId) {
            $q->where('id', $userId);
        })->get();
        // get insta configurations of each user
        foreach ($users as $user) {
            // get user insta automation configurations
            $configurations = InstagramTrackingConfiguration::where('user_id', $user->id)
            ->when($confId, function ($q) use ($confId) {
                $q->where('id', $confId);
            })->get();

            // get all fb accounts
            $instagram_accounts = $user->instagram_accounts;

            foreach ($instagram_accounts as $instagram_account) {
                // get all insta posts from database
                $instagram_posts_from_database = $instagram_account->posts;
                $page_access_token = $instagram_account->token;
                $instagram_posts_from_meta = (new InstagramAccountController())->getInstagramAccountPosts($page_access_token, $instagram_account->instagram_account_id);

                foreach($configurations as $configuration) {
                // check if there is a new post
                    if ((int)count($instagram_posts_from_meta) > (int)$instagram_posts_from_database->count() || $forceSave) {
                        // check configuration if it's enabled to create annotation
                        if ($configuration->when_new_post_on_instagram) {
                            $new_posts_count = (int)count($instagram_posts_from_meta) - (int)$instagram_posts_from_database->count();
                            for($i=0; $i < $new_posts_count; $i++){
                                $data = @$instagram_posts_from_meta[$i]; // latest post 
                                $this->createAutomationAnnotation('when_new_post_on_instagram', $user, $data);
                            }
                        }
                    }

                    foreach ($instagram_posts_from_meta as $instagram_post_from_meta) {
                        foreach ($instagram_posts_from_database as $instagram_post_from_database) {
                            if($instagram_post_from_meta['id'] == $instagram_post_from_database->instagram_post_id){

                                $likes_insta = (int)@$instagram_post_from_meta['likes_count'];
                                $likes_db = (int)$instagram_post_from_database->likes_count;
                                $comments_insta = (int)@$instagram_post_from_meta['comments_count'];
                                $comments_db = (int)$instagram_post_from_database->comments_count;

                                $views_insta = (int)$instagram_post_from_meta['views_count'];
                                $views_db = (int)$instagram_post_from_database->views_count;

                                if ($configuration->is_post_likes_tracking_on){
                                    $when_post_reach_likes = (int)$configuration->when_post_reach_likes;
                                    if ($likes_insta > $likes_db || $forceSave){
                                        if ($likes_insta >= $when_post_reach_likes){
                                            $data = [
                                                "likes" => $likes_insta,
                                                "url" => @$instagram_post_from_meta['post_url']
                                            ];
                                            $this->createAutomationAnnotation('when_post_reach_likes', $user, $data);
                                        }
                                    }
                                }

                                if ($configuration->is_post_comments_tracking_on){
                                    $when_post_reach_comments = (int)$configuration->when_post_reach_comments;
                                    if ($comments_insta > $comments_db || $forceSave){
                                        if ($comments_insta >= $when_post_reach_comments){
                                            $data = [
                                                "comments" => $comments_insta,
                                                "url" => @$instagram_post_from_meta['post_url']
                                            ];
                                            $this->createAutomationAnnotation('when_post_reach_comments', $user, $data);
                                        }
                                    }
                                }

                                if ($configuration->is_post_views_tracking_on){
                                    $when_post_reach_views = (int)$configuration->when_post_reach_views;
                                    if ($views_insta > $views_db || $forceSave){
                                        if ($views_insta >= $when_post_reach_views){
                                            $data = [
                                                "views" => $views_insta,
                                                "url" => @$instagram_post_from_meta['post_url']
                                            ];
                                            $this->createAutomationAnnotation('when_post_reach_views', $user, $data);
                                        }
                                    }
                                }

                                if ($configuration->is_post_shares_tracking_on){
                                    $when_post_reach_shares = (int)$configuration->when_post_reach_shares;
                                    if ($views_insta > $views_db || $forceSave){
                                        if ($views_insta >= $when_post_reach_shares){
                                            $data = [
                                                "views" => $views_insta,
                                                "url" => @$instagram_post_from_meta['post_url']
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


    public function createAutomationAnnotation($event, $user, $data)
    {
        switch ($event){
            case 'when_new_post_on_instagram':
                $description = "A new post on instagram profile. </br> View post:";
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'New Post',
                    'url' => @$data['url'],
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_likes':
                $description = "A post on instagram reached ".@$data['likes']." likes.";
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Likes Reached',
                    'url' => @$data['url'],
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_comments':
                $description = "A post on instagram reached ".@$data['comments']." comments.";
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Comments Reached',
                    'url' => @$data['url'],
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_views':
                $description = "A post on instagram reached ".@$data['views']." views.";
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Views Reached',
                    'url' => @$data['url'],
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_shares':
                $description = "A post on instagram reached ".@$data['views']." views.";
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Shares Reached',
                    'url' => @$data['url'],
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            default:
                break;
        }        
    }

}
