<?php

namespace App\Listeners;

use App\Events\UserDataSourceUpdatedOrCreated;
use App\Models\KeywordMeta;
use App\Services\DataForSeoService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class RetrieveDFSTaskIdForKeyword implements ShouldQueue
{

    private $service;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        $this->service = new DataForSeoService();
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\UserDataSourceUpdatedOrCreated  $event
     * @return void
     */
    public function handle(UserDataSourceUpdatedOrCreated $event)
    {

        $userDataSource = $event->userDataSource;
        $keywords = $userDataSource->keywords;
        foreach ($keywords as $keyword) {
            $configurations = $keyword->configurations;
            foreach ($configurations as $configuration) {
                $language_code = $configuration->language;
                $search_engine = $configuration->search_engine;
                $location_code = $configuration->location_code;
                $params = [
                    'language_code' => $language_code,
                    'location_code' => $location_code,
                    'keyword' => $keyword->keyword,
                    'target' => $search_engine . '.com',
                    'search_engine_name' => $search_engine,
                    'depth' => 700 // max = 700
                ];
                $task_id = $this->service->getTaskID($params);
                if ($task_id) {
                    $pivot = KeywordMeta::where('keyword_configuration_id', $configuration->id)->where('keyword_id', $keyword->id)->first();
                    if ($pivot) {
                        $pivot->dfs_task_id = $task_id;
                        $pivot->save();
                        info('Task id retrieved... saved.');
                    }
                }
            }
        }

    }
}
