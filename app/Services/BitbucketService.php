<?php

namespace App\Services;

use Bitbucket;
use App\Models\UserBitbucketAccount;
use Illuminate\Support\Facades\Http;

class BitbucketService
{
    private $client;
    private $client_id;
    private $client_secret;

    public function __construct()
    {
        $this->client = new Bitbucket\Client();
        $this->client_id = config('services.bitbucket.client_id');
        $this->client_secret = config('services.bitbucket.client_secret');
    }

    public function authenticate($token)
    {
        $this->client->authenticate(
            Bitbucket\Client::AUTH_OAUTH_TOKEN,
            $token
        );
    }

    public function getCurrentUser()
    {
        return $this->client->currentUser();
    }

    public function refreshToken(UserBitbucketAccount $bitbucketAccount)
    {
        // $reqBody = [
        //     'grant_type' => 'refresh_token',
        //     'refresh_token' => $bitbucketAccount->refresh_token
        // ];
        // $response = Http::withBasicAuth($this->client_id, $this->client_secret)->post('https://bitbucket.org/site/oauth2/access_token', $reqBody);
        // $respJson = $response->json();
        // $bitbucketAccount->token = $respJson['access_token'];
        // $bitbucketAccount->refresh_token = $respJson['refresh_token'];
        // $bitbucketAccount->save();
        $ch = curl_init();

        $headers = array();
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_URL, 'https://bitbucket.org/site/oauth2/access_token');
        curl_setopt($ch, CURLOPT_USERPWD, $this->client_id . ":" . $this->client_secret);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array('grant_type' => 'refresh_token', 'refresh_token' => $bitbucketAccount->refresh_token)));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

        $return = curl_exec($ch);
        curl_close($ch);

        $response = array();
        $response = json_decode($return);

        $bitbucketAccount->token = $response->access_token;
        $bitbucketAccount->refresh_token = $response->refresh_token;
        $bitbucketAccount->save();

        return $bitbucketAccount;
    }

    public function getWorkspaces()
    {
        $workspaces = $this->client->currentUser()->listWorkspaces()["values"];
        foreach ($workspaces as $key => $workspace) {
            $repositories = $this->client->repositories()->workspaces($workspace['slug'])->list()['values'];
            $workspaces[$key]['repositories'] = $repositories;
        }

        return $workspaces;
    }

    public function getCommits($workspace, $repository)
    {
        $commits = $this->client->repositories()->workspaces($workspace)->commits($repository)->list()['values'];

        return $commits;
    }
}
