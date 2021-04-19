<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnnotationGaAccount extends Model
{
    use HasFactory;

    public function googleAccount()
    {
        return $this->belongsTo('App\Models\GoogleAccount');
    }

    /**
     * Get the googleAnalyticsProperty that owns the AnnotationGaAccount
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function googleAnalyticsProperty(): BelongsTo
    {
        return $this->belongsTo(GoogleAnalyticsProperty::class);
    }
}
