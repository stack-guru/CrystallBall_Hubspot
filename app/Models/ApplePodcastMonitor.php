<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplePodcastMonitor extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "user_id",
        "url",
        "ga_property_id"
    ];

    protected $dates = [
        'last_synced_at'
    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    /**
     * Get the gaProperty that owns the WebMonitor
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function googleAnalyticsProperty(): BelongsTo
    {
        return $this->belongsTo(GoogleAnalyticsProperty::class, 'ga_property_id', 'id');
    }
}
