<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricePlanSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'expires_at', 'coupon_id',
        'transaction_id'
    ];
    
}
