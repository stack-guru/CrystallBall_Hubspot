<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnotationGaProperty extends Model
{
    use HasFactory;

    protected $fillable = [
        'annotation_id',
        'google_analytics_property_id',
    ];

    public function googleAnalyticsProperty()
    {
        return $this->belongsTo('App\Models\GoogleAnalyticsProperty');
    }

    public function annotation()
    {
        return $this->belongsTo('App\Models\Annotation');
    }
}
