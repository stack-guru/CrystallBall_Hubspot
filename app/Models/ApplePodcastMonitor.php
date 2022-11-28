<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplePodcastMonitor extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "user_id",
        "url",
        "ga_property_id"
    ];

    protected $dates = [
        'last_synced_at'
    ];
}
