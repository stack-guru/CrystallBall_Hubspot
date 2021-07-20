<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChromeExtensionLog extends Model
{
    use HasFactory;

    public $fillable = [

        'event_name',

    ];
}
