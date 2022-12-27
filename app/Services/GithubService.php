<?php

namespace App\Services;

use Github;
use App\Models\UserGithubAccount;
class GithubService
{
    private $client;

    public function __construct()
    {
        $this->client = new Github\Client();
    }

    public function authenticate($token)
    {
        $this->client->authenticate(
            $token,
            null,
            Github\Client::AUTH_ACCESS_TOKEN
        );
    }

    public function getCurrentUser()
    {
        return $this->client->api("current_user");
    }

    public function getRepositories($github_username)
    {
        $repositories = $this->client->api("current_user")->repositories($github_username);
        return $repositories;
    }

    public function getCommits($workspace, $repository)
    {
        $commits = $this->client->api('repo')->commits()->all($workspace, $repository, []);

        return $commits;
    }
}
