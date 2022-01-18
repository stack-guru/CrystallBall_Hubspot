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

    public static function markInUse($id)
    {
        $googleAnalyticsProperty = self::find($id);
        if (!$googleAnalyticsProperty->is_in_use) {
            $googleAnalyticsProperty->is_in_use = true;
            $googleAnalyticsProperty->save();
        }
    }
}
