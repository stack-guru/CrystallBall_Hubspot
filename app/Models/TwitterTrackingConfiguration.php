<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TwitterTrackingConfiguration extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'user_id',
        'is_tweets_likes_tracking_on',
        'when_tweet_reach_likes',
        'is_tweets_retweets_tracking_on',
        'when_tweet_reach_retweets',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_tweets_likes_tracking_on'    => 'boolean',
        'is_tweets_retweets_tracking_on' => 'boolean',
    ];

    /**
     * Get Model Instance
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
