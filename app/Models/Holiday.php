<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'category', 'event_name', 'description', 'country_name', 'holiday_date',
        'url', 'event_type', 'description2',
    ];
}
