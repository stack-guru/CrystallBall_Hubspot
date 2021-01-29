<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpenWeatherMapAlert extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'sender_name', 'event', 'description', 'alert_date', 'open_weather_map_city_id',
    ];
}
