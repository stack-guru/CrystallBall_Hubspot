<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Auth;

class Annotation extends Model
{
    protected $fillable = [
        'user_id', 'category', 'event_type', 'event_name',
        'url', 'description', 'title', 'show_at', 'type',
        'is_enabled',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function annotationGaAccounts()
    {
        return $this->hasMany('App\Models\AnnotationGaAccount');
    }

    public function scopeOfCurrentUser($query){
        return $query->where('user_id', Auth::id());
    }
}
