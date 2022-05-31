<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDataSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'ds_code',
        'ds_name',
        'country_name',
        'retail_marketing_id',
        'open_weather_map_city_id',
        'open_weather_map_event',
        'status',
        'value',
        'is_enabled',
        'ga_property_id',
        'meta'
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    public function openWeatherMapCity()
    {
        return $this->belongsTo('App\Models\OpenWeatherMapCity');
    }

    /**
     * Get the user that owns the UserDataSource
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    static public function disableDataSources($user)
    {
        $user->is_ds_holidays_enabled = false;
        $user->is_ds_google_algorithm_updates_enabled = false;
        $user->is_ds_retail_marketing_enabled = false;
        $user->is_ds_google_alerts_enabled = false;
        $user->is_ds_weather_alerts_enabled = false;
        $user->is_ds_wordpress_updates_enabled = false;
        $user->is_ds_web_monitors_enabled = false;
        $user->save();
    }
}
