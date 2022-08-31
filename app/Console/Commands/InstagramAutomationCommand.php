<?php

namespace App\Console\Commands;

use App\Http\Controllers\InstagramAccountController;
use App\Models\InstagramTrackingAnnotation;
use App\Models\InstagramTrackingConfiguration;
use App\Models\User;
use App\Services\InstagramService;
use Illuminate\Console\Command;

class InstagramAutomationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:execute-instagram-automation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get configurations for instagram automation of all GA users and create annotations if data is changed.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // get all ga users whose insta automation is on
        $users = User::where('is_ds_instagram_tracking_enabled', true)->get();
        // get insta configurations of each user
        foreach ($users as $user) {
            // get user insta automation configurations
            $configuraion = InstagramTrackingConfiguration::where('user_id', $user->id)->first();

            // get all fb accounts
            $instagram_accounts = $user->instagram_accounts;

            foreach ($instagram_accounts as $instagram_account) {
                // get all insta posts from database
                $instagram_posts_from_database = $instagram_account->posts;
                $page_access_token = $instagram_account->token;
                $instagram_posts_from_meta = (new InstagramAccountController())->getInstagramAccountPosts($page_access_token, $instagram_account->instagram_account_id);
                // check if there is a new post
                if ((int)count($instagram_posts_from_meta) > (int)$instagram_posts_from_database->count()) {
                    // check configuration if it's enabled to create annotation
                    if ($configuraion->when_new_post_on_instagram) {
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

                            if ($configuraion->is_post_likes_tracking_on){
                                $when_post_reach_likes = (int)$configuraion->when_post_reach_likes;
                                if ($likes_insta > $likes_db){
                                    if ($likes_insta >= $when_post_reach_likes){
                                        $data = [
                                            "likes" => $likes_insta,
                                            "url" => @$instagram_post_from_meta['post_url']
                                        ];
                                        $this->createAutomationAnnotation('when_post_reach_likes', $user, $data);
                                    }
                                }
                            }

                            if ($configuraion->is_post_comments_tracking_on){
                                $when_post_reach_comments = (int)$configuraion->when_post_reach_comments;
                                if ($comments_insta > $comments_db){
                                    if ($comments_insta >= $when_post_reach_comments){
                                        $data = [
                                            "comments" => $comments_insta,
                                            "url" => @$instagram_post_from_meta['post_url']
                                        ];
                                        $this->createAutomationAnnotation('when_post_reach_comments', $user, $data);
                                    }
                                }
                            }

                            if ($configuraion->is_post_views_tracking_on){
                                $when_post_reach_views = (int)$configuraion->when_post_reach_views;
                                if ($views_insta > $views_db){
                                    if ($views_insta >= $when_post_reach_views){
                                        $data = [
                                            "views" => $views_insta,
                                            "url" => @$instagram_post_from_meta['post_url']
                                        ];
                                        $this->createAutomationAnnotation('when_post_reach_views', $user, $data);
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
                $description = "A new post on instagram profile. </br> View post:  </br>" . @$data['post_url'];
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'New Post',
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_likes':
                $description = "A post on instagram reached ".@$data['likes']." likes. </br> View post:  </br>" . @$data['url'];
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Likes Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_comments':
                $description = "A post on instagram reached ".@$data['comments']." comments. </br> View post:  </br>" . @$data['url'];
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Comments Reached',
                    'title' => $data['description'] ?? "",
                    'description' => $description,
                    'show_at' => today()
                ]);
                break;
            case 'when_post_reach_views':
                $description = "A post on instagram reached ".@$data['views']." views. </br> View post:  </br>" . @$data['url'];
                InstagramTrackingAnnotation::create([
                    'user_id' => $user->id,
                    'category' => 'Instagram',
                    'event_type' => 'Alert',
                    'event_name' => 'Views Reached',
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
