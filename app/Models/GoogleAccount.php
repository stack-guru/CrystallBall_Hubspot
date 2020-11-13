<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $hidden = [
        'token', 'refresh_token'
    ];

    protected $casts = [
        'expires_in' => 'datetime',
    ];
}
