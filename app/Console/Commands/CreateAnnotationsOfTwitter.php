<?php

namespace App\Console\Commands;

use App\Enums\TwitterTrackingEventNameEnum;
use App\Models\TwitterTrackingAnnotation;
use App\Models\User;
use App\Models\UserTwitterAccount;
use App\Repositories\TwitterTrackingAnnotationRepository;
use App\Services\TwitterService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

class CreateAnnotationsOfTwitter extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:create-annotations-of-twitter';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Annotations of Twitter when events triggered set by end user.';

    /**
     * @var array<TwitterTrackingAnnotation>
     */
    private $annotations = [];

    /**
     * @var TwitterService
     */
    private $twitterService;

    /**
     * @var TwitterTrackingAnnotationRepository
     */
    private $twitterTrackingRepository;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(TwitterService $twitterService, TwitterTrackingAnnotationRepository $twitterTrackingRepository)
    {
        parent::__construct();

        $this->twitterService            = $twitterService;
        $this->twitterTrackingRepository = $twitterTrackingRepository;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::with(['twitterAccounts:id,user_id,account_id', 'twitterTrackingConfiguration'])
            ->whereHas('twitterAccounts')
            ->whereHas('twitterTrackingConfiguration')
            ->where('is_ds_twitter_tracking_enabled', true)
            ->get();

        $this->output->progressStart($users->count());
        foreach ($users as $user) {

            $this->handleUser($user, $user->twitterAccounts->first());

            $this->output->progressAdvance();
        }
        $this->output->progressFinish();

        $this->alert(count($this->annotations) . " annotations created successfully!");

        return SymfonyCommand::SUCCESS;
    }

    /**
     * Decision to create annotations for user
     *
     * @param User $user
     * @return void
     */
    private function handleUser(User $user, UserTwitterAccount $account)
    {
        $accountId = $account->account_id;

        $tweets = $this->twitterService->getTweetsByUserId($accountId);
        foreach ($tweets as $tweet) {
            $metrics = $tweet['public_metrics'];

            if ($user->twitterTrackingConfiguration->is_tweets_likes_tracking_on && $metrics['like_count'] >= $user->twitterTrackingConfiguration->when_tweet_reach_likes) {
                $this->createAnnotation($user, $tweet, TwitterTrackingEventNameEnum::REACHED_LIKES);
            }

            if ($user->twitterTrackingConfiguration->is_tweets_retweets_tracking_on && $metrics['retweet_count'] >= $user->twitterTrackingConfiguration->when_tweet_reach_retweets) {
                $this->createAnnotation($user, $tweet, TwitterTrackingEventNameEnum::REACHED_RETWEETS);
            }
        }
    }

    private function createAnnotation(User $user, array $tweet, string $event)
    {
        $annotation = TwitterTrackingAnnotation::where([
            'user_id'    => $user->id,
            'event_name' => $event,
            'tweet_id'   => $tweet['id'],
        ])->count();

        if (!$annotation) {

            $payload = [
                'user_id'     => $user->id,
                'url'         => "https://twitter.com/i/web/status/" . $tweet['id'],
                'description' => Str::limit($tweet['text'], 50),
                'title'       => 'Tweet',
                'tweet_id'    => $tweet['id'],
            ];

            switch ($event) {
                case TwitterTrackingEventNameEnum::REACHED_LIKES:
                    $this->annotations[] = $this->twitterTrackingRepository->createAnnotationWhenReachedLikes($payload);
                    break;
                case TwitterTrackingEventNameEnum::REACHED_RETWEETS:
                    $this->annotations[] = $this->twitterTrackingRepository->createAnnotationWhenReachedRetweets($payload);
                    break;
            }

        }
    }
}
