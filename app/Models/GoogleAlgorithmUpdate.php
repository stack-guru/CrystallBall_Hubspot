<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleAlgorithmUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'event_name',
        'description',
        'update_date',
        'url',
    ];

    protected $casts = [
        'update_date' => 'date'
    ];
}
