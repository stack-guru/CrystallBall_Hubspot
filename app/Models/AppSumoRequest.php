<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSumoRequest extends Model
{
    use HasFactory;

    private $fillable = [
        'action',
        'plan_id',
        'uuid',
        'activation_email',
        'invoice_item_uuid',
    ];
}
