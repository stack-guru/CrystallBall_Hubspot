<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ApplePodcastAnnotation;
use App\Models\ApplePodcastMonitor;
use App\Models\UserDataSource;
use App\Services\ApplePodcastService;
use Illuminate\Support\Carbon;

class ApplePodcastAnntation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:apple-podcast-annotation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch event name, category and description from Apple Podcast Account';

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

        $apMonitors = ApplePodcastMonitor::get();
        $applePodcastService = new ApplePodcastService();
        foreach($apMonitors as $monitor){

            $url = $monitor->url;
            $userId = $monitor->user_id;
            $feedUrl = $monitor->feed_url;

            $podcastData = $applePodcastService->saveApplePodcasts($feedUrl, $url, $userId);
            $monitor->last_synced_at = Carbon::now();
            $monitor->save();
            

        }
    }
}
