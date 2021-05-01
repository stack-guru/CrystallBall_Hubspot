<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebMonitor extends Model
{
    use HasFactory;

    protected $fillable = [

        'name',
        'url',
        'email_address',
        'sms_phone_number',
        // 'uptime_robot_id',
        // 'last_status',
        // 'last_synced_at',

    ];

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

    /**
     * Get the user that owns the WebMonitor
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
