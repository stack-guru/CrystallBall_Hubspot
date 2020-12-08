<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailMarketing extends Model
{
    use HasFactory;
    protected $fillable=[
        'category','event_name','description','url','show_at'
    ];
}
