<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class UserRegistrationOffer extends Model
{
    use HasFactory;

    protected $fillable = [

        'name',
        'code',

        'heading',
        'description',
        'on_click_url',

        "usage_count",
        'discount_percent',
        'expires_at',
        'recurring_discount_count',

        'ip_adddress',

    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function scopeAlive($query)
    {
        return $query->where('expires_at', '>=', Carbon::now());
    }

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }
}
