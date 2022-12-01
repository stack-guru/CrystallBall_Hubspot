<?php

namespace App\Services;

use App\Exceptions\TwitterException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class TwitterService
{
    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var string
     */
    private $token;

    /**
     * @var string
     */
    private $tokenSecret;

    /**
     * @var string
     */
    private $userId;

    /**
     * @var \Illuminate\Http\Client\Factory
     */
    private $httpClient;

    public function __construct(\Illuminate\Http\Client\Factory $http) {
        $this->baseUrl = "https://api.twitter.com/2/";
        $this->httpClient = $http->withToken(config('services.twitter.bearer_token'))
                                ->baseUrl($this->baseUrl);
    }

    /**
     * Get user by twitter account user id
     *
     * @param string $id
     * @return array
     */
    public function getUserById(string $id): array
    {
        $response = $this->httpClient->get("users/{$id}");

        if($response->status() != Response::HTTP_OK){
            throw new TwitterException("Error Processing Request", Response::HTTP_NOT_IMPLEMENTED);
        }

        return $response->json('data');
    }

    /**
     * Get Tweets by twitter account user id with pagination
     *
     * @param string $id
     * @return array
     */
    public function getTweetsByUserId(string $id): array
    {
        $response = $this->httpClient->get("users/{$id}/tweets");

        if($response->status() != Response::HTTP_OK){
            throw new TwitterException("Error Processing Request", Response::HTTP_NOT_IMPLEMENTED);
        }

        return $response->json();
    }
}
