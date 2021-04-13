<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleAnalyticsProperty extends Model
{
    use HasFactory;

    protected $fillable = [

        'property_id',
        'kind',
        'self_link',
        'account_id',
        'internal_property_id',
        'name',
        'website_url',
        'level',
        'profile_count',
        'industry_vertical',
        'default_profile_id',
        'data_retention_ttl',
        'created',
        'updated',
        'parent_type',
        'parent_link',
        'child_type',
        'child_link',
        'permissions',

    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('google_analytics_properties.user_id', Auth::id());
    }

}
