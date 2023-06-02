<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\YoutubeMonitor;
use App\Models\User;
use App\Services\YoutubeService;

class YoutubeAutomationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:execute-youtube-automation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get configurations for youtube automation of all GA users and create annotations if data is changed.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    protected $youtubeService;
    public function __construct()
    {
        parent::__construct();
        $this->youtubeService = new YouTubeService();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::where('is_ds_youtube_tracking_enabled', true)->get();
        foreach($users as $user) {
            $monitors = YoutubeMonitor::where('user_id', $user->id)->get();
            foreach($monitors as $monitor) {
                $channelName = explode('@', $monitor->url)[1];
                $this->youtubeService->storeVideosData($user, $channelName, $monitor);
            }
        }

    }

}
