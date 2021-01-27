<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpenWeatherMapCity extends Model
{
    use HasFactory;

    protected $fillable = [
        'owmc_id',
        'name',
        'state_name',
        'country_code',
        'country_name',
        'longitude',
        'latitude',
    ];
}
