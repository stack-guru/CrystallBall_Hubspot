<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use function GuzzleHttp\Promise\task;

class DataForSeoService
{
    protected $http;

    /**
     * Construct the class and set user and pass
     */
    public function __construct()
    {
        $this->http = Http::withBasicAuth(env('DFS_USER'), env('DFS_PASS'))->withHeaders(['Content-Type' => 'application/json']);
    }

    /**
     * @param array $params
     * @return false|void
     * To get search results for given parameters, we need to make two requests
     * First request returns the task id which will be sent in second request to that fetches search results
     * Same task id can be used multiple times, we can save it if needed.
     */
    public function getSearchResults($keyword, $seach_engine, $location_code, $language_code)
    {

        $params = [
            'language_code' => $language_code,
            'location_code' => $location_code,
            'keyword' => $keyword,
            'target' => $seach_engine,
            'depth' => 700 // 700 max records
        ];

        /*
         * Make a post request to DFS with parameters to get Task ID
         * */
        $task_id = $this->getTaskID($params);
        dump($task_id);


        /*
         * Get search results from DFS for a given Task ID
         * */
        if ($task_id) {
            return $this->getResultsForSERPGoogleOrganicTask($task_id);
        } else {
            return false;
        }
    }

    public function getTaskID($params)
    {
        /*
         * Need to wrap object inside array (otherwise it won't work)
         * */
        $params = [$params];
        /*
         * Get Task ID
         * */
        $url = "https://api.dataforseo.com/v3/serp/google/organic/task_post";
        $_res_1 = $this->http->withBody(json_encode($params), 'application/json')->post($url)->collect()->all();
        return $_res_1['tasks'][0]['id'] ?? false;
    }

    /**
     * @param string $task_id
     * @return false|mixed
     * Get search results for given task ID
     * Sometimes it can return status_code=40602, which means our request is in DFS queue and can be accessed in few seconds
     * In that case we need to make another request after few seconds using same id
     */
    public function getResultsForSERPGoogleOrganicTask(string $task_id = '')
    {
        // endpoint
        $url2 = 'https://api.dataforseo.com/v3/serp/google/organic/task_get/advanced/' . $task_id;
        // fetch results
        $_res_2 = $this->http->get($url2)->collect()->all();
        // necessary checks
        // if the request is successfully done, return the data
        if (isset($_res_2['tasks']['0']['status_code']) && $_res_2['tasks']['0']['status_code'] == '20000') {
            return $_res_2;
        }
        return false;
    }
}
