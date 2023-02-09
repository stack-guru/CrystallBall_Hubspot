<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class websiteTechnologyLookup extends Model
{
    use HasFactory;
    protected $fillable = [
        'site_url'
    ];
}
