<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanNotification extends Model
{
    use HasFactory;
    protected $fillable = [
        'text', 'user_id','type'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
