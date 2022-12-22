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
     * @var \Illuminate\Http\Client\Factory
     */
    private $httpClient;

    public function __construct(\Illuminate\Http\Client\Factory$http)
    {
        $this->baseUrl    = "https://api.twitter.com/2/";
        $this->httpClient = $http->withToken(config('services.twitter.bearer_token'))
            ->baseUrl($this->baseUrl);
    }

    /**
     * Get user by twitter account username (nickname)
     *
     * @param string $username
     * @return array
     */
    public function getUserByUsername(string $username): array
    {
        $response = $this->httpClient->get("users/by/username/{$username}");

        if ($response->status() != Response::HTTP_OK) {
            throw new TwitterException("Error Processing Request", Response::HTTP_NOT_IMPLEMENTED);
        }

        return $response->json('data');
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

        if ($response->status() != Response::HTTP_OK) {
            throw new TwitterException("Error Processing Request", Response::HTTP_NOT_IMPLEMENTED);
        }

        return $response->json('data');
    }

    /**
     * Get Tweets by twitter account user id
     *
     * @param string $userId
     * @return array
     */
    public function getTweetsByUserId(string $userId): array
    {
        $data = [];

        $response = $this->getTweetsByUserIdAndNextToken($userId);
        $data     = $response['data'];

        return $data;
    }

    /**
     * Get Tweets by twitter account user id with pagination
     *
     * @param string $userId
     * @return array
     */
    public function getTweetsByUserIdAndNextToken(string $userId, string $token = null): array
    {
        $response = $this->httpClient->get("users/{$userId}/tweets", [
            'tweet.fields' => 'public_metrics',
            'max_results'  => 20,
        ]);

        if ($response->status() != Response::HTTP_OK) {
            throw new TwitterException("Error Processing Request", Response::HTTP_NOT_IMPLEMENTED);
        }

        return $response->json();
    }
}
