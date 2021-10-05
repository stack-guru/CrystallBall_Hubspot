<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Annotation extends Model
{

    use HasFactory;
    
    protected $fillable = [
        'category', 'event_type', 'event_name',
        'url', 'description', 'title', 'show_at', 'type',
        'is_enabled', 'added_by'
    ];

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
    
    public function scopeOfCurrentUser($query){
        return $query->where('user_id', Auth::id());
    }
}
