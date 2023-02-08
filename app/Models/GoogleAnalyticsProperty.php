<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

        'color_hex_code',

        'google_search_console_site_id'
    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('google_analytics_properties.user_id', Auth::id());
    }

    /**
     * Get the googleAccount that owns the GoogleAnalyticsProperty
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function googleAccount(): BelongsTo
    {
        return $this->belongsTo(GoogleAccount::class);
    }

    /**
     * Get the googleAnalyticsAccount that owns the GoogleAnalyticsProperty
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function googleAnalyticsAccount(): BelongsTo
    {
        return $this->belongsTo(GoogleAnalyticsAccount::class);
    }

    public static function getColors()
    {
        return [
            '#D96FFF',
            '#A00CE6',
            '#17DE6B',
            '#00BB4F',
            '#04D6E3',
            '#1976FE',
            '#1324B0',

            '#FFB8BF',
            '#FE4C3C',
            '#DE180E',
            '#FFE082',
            '#FFC514',
            '#FF9147',
            '#FF6600',
        ];
    }

    public function googleSearchConsoleSite()
    {
        return $this->belongsTo(GoogleSearchConsoleSite::class);
    }
}
