<?php

namespace App\Repositories;

use App\Enums\TwitterTrackingEventNameEnum;
use App\Models\TwitterTrackingAnnotation;

class TwitterTrackingAnnotationRepository
{
    public function createAnnotationWhenReachedLikes(array $payload)
    {
        return TwitterTrackingAnnotation::create([
            'user_id'     => $payload['user_id'],
            'category'    => 'Twitter',
            'event_type'  => 'Alert',
            'event_name'  => TwitterTrackingEventNameEnum::REACHED_LIKES,
            'title'       => $payload['title'],
            'url'         => $payload['url'],
            'description' => $payload['description'],
            'show_at'     => today(),
            'tweet_id'    => $payload['tweet_id'],
        ]);
    }

    public function createAnnotationWhenReachedRetweets(array $payload)
    {
        return TwitterTrackingAnnotation::create([
            'user_id'     => $payload['user_id'],
            'category'    => 'Twitter',
            'event_type'  => 'Alert',
            'event_name'  => TwitterTrackingEventNameEnum::REACHED_RETWEETS,
            'title'       => $payload['title'],
            'url'         => $payload['url'],
            'description' => $payload['description'],
            'show_at'     => today(),
            'tweet_id'    => $payload['tweet_id'],
        ]);
    }
}
