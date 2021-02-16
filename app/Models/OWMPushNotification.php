<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OWMPushNotification extends Model
{
    use HasFactory;

    protected $fillable = [

        'owm_alert_id',
        'shape',
        'location_coordinates',
        'alert_type',
        'categories',
        'urgency',
        'severity',
        'certainity',
        'alert_date',
        'sender_name',
        'event',
        'headline',
        'description',

        'open_weather_map_city_id',

    ];
}
