<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricePlanSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'expires_at', 'coupon_id',
        'transaction_id', 'charged_price'
    ];

    public function paymentDetail(){
        return $this->belongsTo(PaymentDetail::class);
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function pricePlan()
    {
        return $this->belongsTo('App\Models\PricePlan');
    }

    public function coupon()
    {
        return $this->belongsTo('App\Models\Coupon');
    }

}
