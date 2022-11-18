<?php

namespace App\Console\Commands;

use App\Services\SpotifyService;
use Illuminate\Console\Command;

class FetchSpotifyAnnotationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-instagram-annotations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Spotify HTTP Client Service
     *
     * @var SpotifyService
     */
    protected $service;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(SpotifyService $service)
    {
        $this->service = $service;
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $results = $this->service->getPlaylist("61yLyqdz6hdZiAHMk4Bxxi");

        dd($results);
    }
}
