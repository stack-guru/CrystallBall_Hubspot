<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplePodcastAnnotation extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
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
