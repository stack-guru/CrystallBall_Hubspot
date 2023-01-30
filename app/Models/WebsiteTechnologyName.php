<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteTechnologyName extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'website_technology_lookup_id',
    ];
}
