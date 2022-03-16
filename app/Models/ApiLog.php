<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiLog extends Model
{
    use HasFactory;

    const ANNOTATION_CREATED = 'AnnotationCreated';
    
    public $timestamps = false;

}
