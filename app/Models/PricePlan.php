<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'annotations_count', 'price', 'has_manual_add',
        'has_csv_upload', 'has_api', 'is_enabled','has_integrations',"has_data_sources",
        'ga_account_count', 'user_per_ga_account_count'
    ];

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }
}
