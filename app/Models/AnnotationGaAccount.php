<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnotationGaAccount extends Model
{
    use HasFactory;

    public function googleAccount()
    {
        return $this->belongsTo('App\Models\GoogleAccount');
    }
}
