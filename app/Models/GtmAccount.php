<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GtmAccount extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'account_id',
        'name',
        'user_id',
    ];
}
