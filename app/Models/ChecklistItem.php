<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [

        'name',
        'label',
        'description',
        'url',

        'sort_rank',
    ];
}
