<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoogleSearchConsoleSite extends Model
{
    use HasFactory;

    public function scopeOfCurrentUser($query)
    {
        return $query->where('google_search_console_sites.user_id', Auth::id());
    }

    /**
     * Get the googleAccount that owns the GoogleAnalyticsProperty
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function googleAccount(): BelongsTo
    {
        return $this->belongsTo(GoogleAccount::class);
    }
}
