<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;

class GoogleAnalyticsAccount extends Model
{
    use HasFactory;

    public function scopeOfCurrentUser($query){
        return $query->where('user_id', Auth::id());
    }
}
