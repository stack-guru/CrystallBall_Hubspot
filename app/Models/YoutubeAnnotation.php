<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YoutubeAnnotation extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "category",
        "event",
        "description",
        "url",
        "date"
    ];

    protected $casts =[
        "date" => "date"
    ];
}
