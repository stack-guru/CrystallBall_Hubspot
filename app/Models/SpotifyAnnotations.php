<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpotifyAnnotations extends Model
{
    use HasFactory;

    protected $fillable = [
        "category",
        "event",
        "description",
        "url",
        "podcast_date"
    ];

    protected $casts =[
        "podcast_date" => "date"
    ];
}
