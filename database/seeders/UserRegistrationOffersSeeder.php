<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\PricePlan;

class UserRegistrationOffersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // There are multiple price plans with same name in the system.
        // Don't confuse yourself with their names, focus on id only.
        DB::table('registration_offers')->insert(
            [
                [
                    'name' => '24 days 50% off',
                    'code' => '24-days-50-off',
                    'heading' => 'Registration Offer expiring in [{expires_at}]',
                    'description' => '[{expires_at}] - [{discount_percent}]% OFF on All Plans',
                    'on_click_url' => '1',
                    'discount_percent' => '50',
                    'monthly_recurring_discount_count' => '12',
                    'yearly_recurring_discount_count' => '1',
                    'expires_in_period' => 'days',
                    'expires_in_value' => '24',
                    'is_enabled' => '1',
                ],
            ]
        );
    }
}
