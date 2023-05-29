<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacebookTrackingConfiguration extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function annotations()
    {
        return $this->hasMany('App\Models\FacebookTrackingAnnotation');
    }
}
