<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserStartupConfiguration extends Model
{
    use HasFactory;

    protected $fillable = [
        'step_number',
        'data_label',
        'data_value',
    ];
}
