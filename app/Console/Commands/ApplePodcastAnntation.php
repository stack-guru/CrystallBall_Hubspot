<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ApplePodcastAnnotation;
use App\Models\UserDataSource;

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

        $keywords = UserDataSource::selectRaw("LOWER(value) as lValue")
        ->where("ds_code","apple_podcast_annotation_id")
        ->whereNotNull("value")
        ->orderBy("lValue")
        ->distinct()
        ->get()
        ->pluck("lValue")
        ->toArray();

        $applePodcastService = new ApplePodcastService();
        foreach($keywords as $keywords){

            $podcastData = $applePodcastService->getAllApplePodcasts($keywords);
            

        }
    }
}
