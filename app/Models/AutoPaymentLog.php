<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutoPaymentLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_detail_id',
        'price_plan_subscription_id',
        'price_plan_id',

        'card_number',
        'transaction_message',

        'charged_price',
        'was_successful',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function paymentDetail()
    {
        return $this->belongsTo('App\Models\PaymentDetail');
    }

    public function pricePlanSubscription()
    {
        return $this->belongsTo('App\Models\PricePlanSubscription');
    }

    public function pricePlan()
    {
        return $this->belongsTo('App\Models\PricePlan');
    }

}
