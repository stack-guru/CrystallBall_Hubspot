<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class Annotation extends Model
{

    use HasFactory;

    protected $fillable = [
        'category', 'event_type', 'event_name',
        'url', 'description', 'title', 'show_at', 'type',
        'is_enabled', 'added_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'show_at' => 'date'
    ];

    const SAMPLE_ANNOTATION_EVENT_NAME = 'Sample Annotation';

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function annotationGaAccounts()
    {
        return $this->hasMany('App\Models\AnnotationGaAccount');
    }

    public function annotationGaProperties()
    {
        return $this->hasMany('App\Models\AnnotationGaProperty');
    }

    public function scopeOfCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }

}
