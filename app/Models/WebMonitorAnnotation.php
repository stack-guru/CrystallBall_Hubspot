<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebMonitorAnnotation extends Model
{
    use HasFactory;

    protected $fillable = [

        'user_id',

        'category',
        'event_type',
        'event_name',

        'url',
        'description',
        'title',

        'show_at',
        'type',

    ];
}
