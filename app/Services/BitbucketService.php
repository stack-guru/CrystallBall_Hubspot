<?php

namespace App\Services;

use Bitbucket;
class BitbucketService
{
    private $client;

    public function __construct()
    {
        $this->client = new Bitbucket\Client();
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

    public function getWorkspaces()
    {
        $workspaces = $this->client->currentUser()->listWorkspaces()["values"];
        $repositories = [];
        foreach ($workspaces as $key => $workspace) {
            $repositories = $this->client->repositories()->workspaces($workspace['slug'])->list()['values'];

            $workspaces[$key]['repositories'] = $repositories;
        }

        return $workspaces;
    }
}
