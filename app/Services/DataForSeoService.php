<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use function GuzzleHttp\Promise\task;

class DataForSeoService
{
    protected $http;

    /**
     * Construct the class and set user and pass
     */
    public function __construct()
    {
        $this->http = Http::withBasicAuth(config('data_for_seo.credentials.user'), config('data_for_seo.credentials.pass'))->withHeaders(['Content-Type' => 'application/json']);
    }

    /**
     * @param array $params
     * @return false|void
     * To get search results for given parameters, we need to make two requests
     * First request returns the task id which will be sent in second request to that fetches search results
     * Same task id can be used multiple times, we can save it if needed.
     */
    public function getSearchResults($keyword, $search_engine, $location_code, $language_code)
    {

        $params = [
            'language_code' => $language_code,
            'location_code' => $location_code,
            'keyword' => $keyword,
            'target' => $search_engine . '.com',
            'search_engine_name' => $search_engine,
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
        $param_new = [$params];
        /*
         * Get Task ID
         * $params['search_engine_name'] can be google, bing, yahoo, baidu, naver
         * */
        $url = "https://api.dataforseo.com/v3/serp/" . $params['search_engine_name'] . "/organic/task_post";
        $_res_1 = $this->http->withBody(json_encode($param_new), 'application/json')->post($url)->collect()->all();
        return $_res_1['tasks'][0]['id'] ?? false;
    }

    /**
     * @param string $task_id
     * @param string $search_engine
     * @return array|false
     * Get search results for given task ID
     * Sometimes it can return status_code=40602, which means our request is in DFS queue and can be accessed in few seconds
     * In that case we need to make another request after few seconds using same id
     */
    public function getResultsForSERPGoogleOrganicTask(string $task_id = '', string $search_engine = 'google')
    {
        // endpoint
        $url2 = 'https://api.dataforseo.com/v3/serp/' . $search_engine . '/organic/task_get/advanced/' . $task_id;
        // fetch results
        $_res_2 = $this->http->get($url2)->collect()->all();
        // necessary checks
        // if the request is successfully done, return the data
        if (isset($_res_2['tasks']['0']['status_code']) && $_res_2['tasks']['0']['status_code'] == '20000') {
            return $_res_2;
        }
        return false;
    }

    /**
     * @return false|mixed
     */
    public function getLocations()
    {
        // endpoint
        $url = 'https://api.dataforseo.com/v3/serp/google/locations';
        // fetch results
        $_res = $this->http->get($url)->collect()->all();
        // if the request is successfully done, return the data
        return $_res['tasks'][0]['result'] ?? false;
    }
}
