<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CookieCoupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'plan_extension_days'
    ];
}
