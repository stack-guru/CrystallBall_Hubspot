<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;

class UserDataSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'ds_code',
        'ds_name',
        'country_name',
        'retail_marketing_id',
        'open_weather_map_city_id',
        'is_enabled'
    ];

    protected $casts = [
        'is_enabled' => 'boolean'
    ];

    public function scopeOfCurrentUser($query){
        return $query->where('user_id', Auth::id());
    }

    public function openWeatherMapCity()
    {
        return $this->belongsTo('App\Models\OpenWeatherMapCity');
    }

}
