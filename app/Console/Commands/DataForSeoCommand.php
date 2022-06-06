<?php

namespace App\Console\Commands;

use App\Models\UserDataSource;
use App\Services\DataForSeoService;
use Illuminate\Console\Command;

class DataForSeoCommand extends Command
{

    private $service;


    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-wesbite-ranking-dfs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetches website ranking in search for given website, location, keyword, and language etc';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->service = new DataForSeoService();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user_data_sources = UserDataSource::with('keywords')->where('ds_code', 'keyword_tracking')->get();
        foreach ($user_data_sources as $data_source) {
            $url = $data_source->url;
            $lang = $data_source->lang;
            $search_engine = $data_source->search_engine;
            $location_code = $data_source->location;
            $ranking_direction = $data_source->ranking_direction;
            $ranking_places = $data_source->ranking_places;
            $keywords = $data_source->keywords->toArray();
            foreach ($keywords as $keyword) {
                if (isset($keyword['keyword'])) {
                    try {
                        $data = $this->service->getSearchResults($url, $keyword['keyword'], $search_engine, $location_code, $lang);
                        dd($data);
                    } catch (\Exception $e) {
                        dd($e->getMessage());
                    }
                }
            }
        }
    }
}
