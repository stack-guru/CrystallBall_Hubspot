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
            'description' => 'some description',
            'on_click_url' => '/settings/price-plans',
            'discount_percent' => '20',
            'monthly_recurring_discount_count' => '12',
            'yearly_recurring_discount_count' => '1',
        ];

        $userSpecificCoupon = new UserSpecificCoupon([
            'name' => $coupon['name'],
            'code' => $coupon['code'],

            'heading' => $coupon['heading'],
            'description' => $coupon['description'],
            'on_click_url' => $coupon['on_click_url'],

            "usage_count" => 0,
            'discount_percent' => $coupon['discount_percent'],
            'expires_at' => Carbon::now()->addHour(24),
            'monthly_recurring_discount_count' => $coupon['monthly_recurring_discount_count'],
            'yearly_recurring_discount_count' => $coupon['yearly_recurring_discount_count'],
        ]);
        $userSpecificCoupon->user_id =  $event->user->id;
        $userSpecificCoupon->save();
    }
}
