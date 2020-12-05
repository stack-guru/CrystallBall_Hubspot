<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;

class UserDataSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'ds_code',
        'ds_name',
        'country_name',
    ];

    public function scopeOfCurrentUser($query){
        return $query->where('user_id', Auth::id());
    }
}
