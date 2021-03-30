<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleAlert extends Model
{
    use HasFactory;

    protected $fillable = [

        'category',
        'title',
        'url',
        'description',

    ];
}
