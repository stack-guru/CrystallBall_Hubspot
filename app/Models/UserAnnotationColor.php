<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAnnotationColor extends Model
{
    use HasFactory;

    protected $fillable = [
        'manual',
        'csv',
        'api',
        'holidays',
        'google_algorithm_updates',
        'retail_marketings',
        'weather_alerts',
        'web_monitors',
        'wordpress_updates',
        'google_alerts',
        'g_ads_history_change',
        'anomolies_detection',
        'budget_tracking',
        'keyword_tracking',
        'facebook_tracking',
        'instagram_tracking',
        'twitter_tracking',
    ];
}
