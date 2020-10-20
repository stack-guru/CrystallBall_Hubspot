<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Annotation extends Model
{
    protected $fillable = [
        'user_id', 'category', 'event_type', 'event_name',
        'url', 'description', 'title', 'show_at', 'type',
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
