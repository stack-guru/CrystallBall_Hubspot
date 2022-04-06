<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'discount_percent', 'expires_at',
        'recurring_discount_count'
    ];

    protected $hidden = [
        'name', 'expires_at', 'created_at', 'updated_at',
        'code', 'usage_count', 'recurring_discount_count'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
