<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleAdsAnnotation extends Model
{
    use HasFactory;

    protected $fillable = [

        'user_id',

        'google_account_id',

        'title',
        'event_name',
        'category',
        'url',
        'description',

        'detected_at',

    ];
}
