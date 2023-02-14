<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GoogleAccount extends Model
{

    const SCOPE_AUTH_USERINFO_PROFILE = 'https://www.googleapis.com/auth/userinfo.profile';
    const SCOPE_AUTH_USERINFO_EMAIL = 'https://www.googleapis.com/auth/userinfo.email';
    const SCOPE_AUTH_ANALYTICS_READONLY = 'https://www.googleapis.com/auth/analytics.readonly';
    const SCOPE_AUTH_WEBMASTERS = 'https://www.googleapis.com/auth/webmasters';
    const SCOPE_AUTH_WEBMASTERS_READONLY = 'https://www.googleapis.com/auth/webmasters.readonly';
    const SCOPE_AUTH_ADWORDS = 'https://www.googleapis.com/auth/adwords';

    use HasFactory;

    protected $fillable = [
        'token',
        'refresh_token',
        'expires_in',
        'account_id',
        'nick_name',
        'name',
        'email',
        'avatar',
        'adwords_client_customer_id',
    ];

    protected $hidden = [
        'token', 'refresh_token',
    ];

    protected $casts = [
        'expires_in' => 'datetime',
    ];

    public function annotations()
    {
        return $this->hasMany('App\Models\Annotation');
    }

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    /**
     * Get all of the googleAnalyticsAccounts for the GoogleAccount
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function googleAnalyticsAccounts(): HasMany
    {
        return $this->hasMany(GoogleAnalyticsAccount::class);
    }

    public function hasSearchConsoleScope(): bool
    {
        return array_search(self::SCOPE_AUTH_WEBMASTERS_READONLY, json_decode($this->scopes)) !== false
            && array_search(self::SCOPE_AUTH_WEBMASTERS, json_decode($this->scopes)) !== false;
    }

    public function hasGoogleAnalyticsScope(): bool
    {
        return array_search(self::SCOPE_AUTH_ANALYTICS_READONLY, json_decode($this->scopes)) !== false;
    }

    public function hasGoogleAdsScope(): bool
    {
        return array_search(self::SCOPE_AUTH_ADWORDS, json_decode($this->scopes)) !== false;
    }
}
