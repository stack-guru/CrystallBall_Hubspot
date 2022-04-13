<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationOffer extends Model
{
    use HasFactory;

    protected $fillable = [

        'name',
        'code',
        'heading',
        'description',

        'on_click_url',
        'discount_percent',

        'monthly_recurring_discount_count',
        'yearly_recurring_discount_count',

        'expires_in_period',
        'expires_in_value',

    ];
}
