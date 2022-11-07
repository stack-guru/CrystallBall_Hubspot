<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
//Model && DataSource Model
use App\Models\SpotifyModel;
use App\Models\UserDataSource;
//Carbon Class dealing with date and time more semantic 
use Illuminate\Support\Carbon;
//Services
use App\Services\SpotifyService;

class SpotifyPodcastCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:spotify-annotation-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch event name, category and description from Spotify Account';

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
        $spotify_service = new SpotifyService();
        //selectRaw use to 
        $keywords = UserDataSource::selectRaw("LOWER(value) as Lvalue")
        ->where("ds_code","spotify_podcast_tracking")
        ->whereNotNull("value")
        ->orderBy("Lvalue")
        ->distinct()
        ->get()
        ->pluck("Lvalue")
        ->toArray();

        $alertDate = new Carbon();
        foreach($keywords as $keywords){
            $allAlerts = $spotify_service($keywords);
            if(is_array($alertDate)){
                foreach($allAlerts as $categoryName => $categoryAlert){
                    foreach ($categoryAlert as $alert) {
                        if (stripos($alert['category'], $keyword) || stripos($alert['description'], $keyword)) {
                            if (!SpotifyModel::where('url', $alert['url'])->count()) {
                                $spotifyAlert = new SpotifyModel;
                                $spotifyAlert->alert_date = $alertDate;
                                $spotifyAlert->event = $keyword;
                                $spotifyAlert->category = $categoryName;
                                $spotifyAlert->url = $alert['url'];
                                $spotifyAlert->description = $alert['description'];

                                if (array_key_exists('podcast_date', $alert)) {
                                    $spotifyAlert->image = $alert['podcast_date'];
                                }

                                $spotifyAlert->save();
                            }
                        }
                    } 
                }
            }
        }
        return 0;
    }
}

