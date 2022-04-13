<?php

namespace App\Listeners;

use App\Models\RegistrationOffer;
use App\Models\UserRegistrationOffer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Carbon;

class CreateUserRegistrationOffer
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
        $registrationOffers = RegistrationOffer::enabled()->get();

        foreach ($registrationOffers as $registrationOffer) {
            $userRegistrationOffer = new UserRegistrationOffer([
                'name' => $registrationOffer->name,
                'code' => $registrationOffer->code,

                'heading' => $registrationOffer->heading,
                'description' => $registrationOffer->description,
                'on_click_url' => $registrationOffer->on_click_url,

                "usage_count" => 0,
                'discount_percent' => $registrationOffer->discount_percent,
                'expires_at' => Carbon::now()->add($registrationOffer->expires_in_value, $registrationOffer->expires_in_period),
                'monthly_recurring_discount_count' => $registrationOffer->monthly_recurring_discount_count,
                'yearly_recurring_discount_count' => $registrationOffer->yearly_recurring_discount_count,
            ]);
            $userRegistrationOffer->user_id =  $event->user->id;
            $userRegistrationOffer->save();
        }
    }
}
