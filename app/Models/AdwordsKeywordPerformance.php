<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdwordsKeywordPerformance extends Model
{
    use HasFactory;

    protected $fillable = [
        'fetched_at',

        'campaign_id',
        'ad_group_id',
        'keyword_id',

        'campaign_name',
        'ad_group_name',
        'keyword_name',

        'clicks',

        'google_account_id',

        'user_id',
    ];
}
