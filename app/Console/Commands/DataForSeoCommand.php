<?php

namespace App\Console\Commands;

use App\Events\serpResultsProcessed;
use App\Events\UserDataSourceUpdatedOrCreated;
use App\Models\Keyword;
use App\Models\KeywordMeta;
use App\Models\KeywordTrackingAnnotation;
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
            $keywords = $data_source->keywords;
            foreach ($keywords as $keyword) {
                // get configurations of keyword
                $configurations = $keyword->configurations;
                foreach ($configurations as $configuration) {
                    $pivot = KeywordMeta::where('keyword_configuration_id', $configuration->id)->where('keyword_id', $keyword->id)->first();
                    if ($pivot->dfs_task_id) {
                        $data = $this->service->getResultsForSERPGoogleOrganicTask($pivot->dfs_task_id, $configuration->search_engine);
                        if (isset($data['tasks'][0]['result'][0]['items']) && !empty($data['tasks'][0]['result'][0]['items'])) {
                            $items = $data['tasks'][0]['result'][0]['items'];
                            $url = $configuration->url;
                            $ranking_direction = $configuration->ranking_direction;
                            $ranking_places = (int)$configuration->ranking_places_changed;
                            $this->processResults($items, $url, $ranking_direction, $ranking_places, $keyword, $pivot, $configuration);
                            info('results are processed for a  particular keyword');
                        }
                    }
                    
                }
                // refresh the Task IDs of all data sources
                UserDataSourceUpdatedOrCreated::dispatch($data_source);
                info('event is triggered and queued to update the task id, that wil be processed tommorow');
            }
        }
    }

    // processing records from DFS results
    public function processResults($items, $url, $ranking_direction, $ranking_places, $keyword, $pivot, $configuration)
    {
        // info("processing results  " . __LINE__ . " results: " . print_r($items, 1));
        // items being an array of results from Data For SEO API
        foreach ($items as $result) {
            
            // if result domain string contains our url domain
            // it means its ranking
            // for example if our website: "testwebsite.com" is included in result "www.testwebsite.com"
            if (isset($result['domain']) && strpos($result['domain'], $url) !== false) {
                info('your domain exists in the list');
                // check if we have received absolute rank value in the result
                if (isset($result['rank_absolute'])) {
                    // check if we have stored previous rank position in the database
                    // for the first time, we may not have ranking value in our database
                    if (!$pivot->current_ranking) {
                        info('no existing ranking in the database');
                        // just store the rankings and do not process further
                        // process later when we have value in our database to compare the result position to.
                        $pivot->current_ranking = $result['rank_absolute'];
                        $pivot->save();
                    } else {
                        info('existing ranking found in the database');
                        // we already have some ranking saved in our database
                        // compare the ranking from result with our previous stored ranking value
                        // if there is change in the position by X places than we create an annotation
                        $previous_ranking = (int)$pivot->current_ranking;
                        $new_ranking = (int)$result['rank_absolute'];
                        $pivot->current_ranking = $new_ranking;
                        $pivot->save();
                        // if current ranking is greater than new ranking
                        // it means our website has gained position in ranking
                        if ($previous_ranking > $new_ranking) {
                            info('our website gained position in ranking');
                            $rank_difference = $previous_ranking - $new_ranking;
                            $ranked_higher = true;
                        }
                        // if new ranking is greater than current ranking
                        // it means our website has lost position in ranking
                        else if ($new_ranking > $previous_ranking) {
                            info('our website lost position in ranking');
                            $rank_difference = $new_ranking - $previous_ranking;
                            $ranked_higher = false;
                        }
                        // ranking is same dont perform any action, for now
                        else {
                            break;
                        }
                        // check how many places our website is ranked higher or lower
                        // if it is not ranked (higher or lower) more than our defined ranking places value, than it does not matter in which direction it is ranked
                        // if it is greater than our defined places
                        // than we process further
                        if ($rank_difference >= $ranking_places) {
                            info('website is ranked higher or equals than your defined ranking_places');
                            // check in which case (up or down) do we need to process further...
                            // if our specified direction is up
                            if ($ranking_direction == 'up') {
                                info("our specified direction is up");
                                // if our website actually ranked up
                                if ($ranked_higher) {
                                    info("our website actually ranked up");
                                    // create annotation
                                    $this->createKeywordTrackingAnnotation($ranking_direction, $rank_difference, $keyword, $configuration, $new_ranking);
                                }
                            }
                            // if our specified direction is down
                            else if ($ranking_direction == 'down') {
                                info("our specified direction is down");

                                // if our website is not ranked up
                                if (!$ranked_higher) {
                                    info("our website actually ranked down");
                                    // create annotation
                                    $this->createKeywordTrackingAnnotation($ranking_direction, $rank_difference, $keyword, $configuration, $new_ranking);
                                }
                            }
                        }
                    }
                }
            } 
        }
    }

    //create annotation in the database
    public function createKeywordTrackingAnnotation($ranking_direction, $ranking_difference, $keyword, $configuration, $current_position)
    {

        $whose_website = ($configuration->is_url_competitors) ? "Competitor's website " : "Your website ";

        $description = $whose_website. "moves ". $ranking_difference. " positions " . $ranking_direction . " to " . $current_position . " place under the keyword ". $keyword->keyword;

        info("creating annotation");

        KeywordTrackingAnnotation::create([
            'user_id' => $keyword->user_data_source->user_id,
            'category' => 'Keyword Tracking',
            'eventy_type' => 'Ranking',
            'event_name' => $configuration->url,
            'description' => $description,
            'title' => 'Website ranking is changed for keyword "' . $keyword->keyword . '"',
            'show_at' => today()
        ]);
    }
}
