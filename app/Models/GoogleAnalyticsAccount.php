<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $query->where('user_id', Auth::id());
    }

    public function googleAccount()
    {
        return $this->belongsTo('App\Models\GoogleAccount');
    }

}
