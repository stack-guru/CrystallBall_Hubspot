<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::addGlobalScope('ofUS', function (Builder $builder) {
            $builder->where('country_code', 'US');
        });
    }
}
