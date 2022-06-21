<?php

namespace App\Listeners;

use App\Events\UserDataSourceUpdatedOrCreated;
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

        $language_code = $userDataSource->lang;
        $search_engine = $userDataSource->search_engine;
        $location_code = $userDataSource->location;
        $keywords = $userDataSource->keywords;
        foreach ($keywords as $keyword){
            $params = [
                'language_code' => $language_code,
                'location_code' => $location_code,
                'keyword' => $keyword->keyword,
                'target' => $search_engine.'.com',
                'search_engine_name' => $search_engine,
                'depth' => 700 // max = 700
            ];
            $task_id = $this->service->getTaskID($params);
            if($task_id){
                $keyword->task_id = $task_id;
                $keyword->save();
            }
        }


    }
}
