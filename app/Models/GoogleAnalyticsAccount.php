<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GoogleAnalyticsAccount extends Model
{
    use HasFactory;

    protected $hidden = [
        'self_link', 'permissions', 'property_href',
    ];

    protected $casts = [

    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('google_analytics_accounts.user_id', Auth::id());
    }

    public function googleAccount()
    {
        return $this->belongsTo('App\Models\GoogleAccount');
    }

    /**
     * Get all of the googleAnalyticsProperties for the GoogleAnalyticsAccount
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function googleAnalyticsProperties(): HasMany
    {
        return $this->hasMany(GoogleAnalyticsProperties::class);
    }

}
