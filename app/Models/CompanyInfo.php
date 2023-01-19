<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyInfo extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_name',
        'company_name',
        'company_size',
        'industry',
        'language',
        'ip',
        'location',
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
