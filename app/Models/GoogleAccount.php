<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GoogleAccount extends Model
{
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
}
