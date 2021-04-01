<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordpressUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'event_name',
        'description',
        'update_date',
        'url',
        'status',
    ];

    protected $casts = [
        'update_date' => 'date'
    ];
}
