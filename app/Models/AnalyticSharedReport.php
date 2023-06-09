<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticSharedReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'pdf_link',
        'excel_name',
        'start_date',
        'end_date',
        'dashboard_id',
        'recurrence',
        'property_id',
        'google_console_site_id',
        'user_id',
    ];
    public function property()
    {
        return $this->belongsTo('App\Models\GoogleAnalyticsProperty','property_id');
    }
}
