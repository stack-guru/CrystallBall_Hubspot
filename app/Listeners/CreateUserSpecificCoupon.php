<?php

namespace App\Listeners;

use App\Models\UserSpecificCoupon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Carbon;

class CreateUserSpecificCoupon
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        // This variable below, will be replaced by a fetched row from database
        // There should be an interface available in admin area to manage coupon data values
        $coupon = [
            'name' => '24 hours 50p off',
            'code' => '50-off-till-24',
            'heading' => "Special Offer only for the next [{expires_at}], get 50% on the monthly plans",
            'discount_percent' => '50',
            'recurring_discount_count'
        ];

        UserSpecificCoupon::create([
            'name' => $coupon['name'],
            'code' => $coupon['code'],

            'heading' => $coupon['heading'],
            'description' => $coupon['description'],

            "usage_count" => 0,
            'discount_percent' => $coupon['discount_percent'],
            'expires_at' => Carbon::now()->addHour(24),
            'recurring_discount_count' => $coupon['recurring_discount_count'],
        ]);
    }
}
