<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class PaymentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_number',
        'expiry_month',
        'expiry_year',
        'first_name',
        'last_name',
        'billing_address',
        'city',
        'zip_code',
        'country',

        // 'user_id', 'bluesnap_vaulted_shopper_id', 'bluesnap_card_id',
    ];

    public function scopeLastCreated($query)
    {
        return $query->orderBy('created_at', 'DESC')->first();
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function pricePlanSubscription(){
        return $this->hasMany(PricePlanSubscription::class);
    }
}
