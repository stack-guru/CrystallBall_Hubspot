<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserWebhook extends Model
{
    use HasFactory;

    protected $fillable = [

        'request_method',
        'endpoint_uri',

    ];
}
