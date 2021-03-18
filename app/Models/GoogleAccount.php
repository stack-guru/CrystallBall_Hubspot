<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;

class GoogleAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'refresh_token',
        'expires_in',
        'account_id',
        'nick_name',
        'name',
        'email',
        'avatar',
        'adwords_client_customer_id',
    ];

    protected $hidden = [
        'token', 'refresh_token'
    ];

    protected $casts = [
        'expires_in' => 'datetime',
    ];

    public function annotations()
    {
        return $this->hasMany('App\Models\Annotation');
    }

    public function scopeOfCurrentUser($query){
        return $query->where('user_id', Auth::id());
    }
}
