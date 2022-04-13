<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class PricePlanSubscriptionsListTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testPricePlanSubscriptionsList()
    {
        do {
            $user = User::inRandomOrder()->firstOrFail();
        } while ($user->pricePlanSubscriptions()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/ui/settings/price-plan-subscription');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'price_plan_subscriptions' => [
                    '*' => [
                        "id",
                        "user_id",
                        "expires_at",
                        "coupon_id",
                        "created_at",
                        "updated_at",
                        "transaction_id",
                        "price_plan_id",
                        "payment_detail_id",
                        "charged_price",
                        "left_coupon_recurring",
                        "app_sumo_invoice_item_uuid",
                        "plan_duration",
                        "payment_detail" => [
                            "id",
                            "card_number",
                            "expiry_month",
                            "expiry_year",
                            "bluesnap_card_id",
                            "first_name",
                            "last_name",
                            "billing_address",
                            "city",
                            "zip_code",
                            "country",
                            "bluesnap_vaulted_shopper_id",
                            "user_id",
                            "created_at",
                            "updated_at",
                            "charged_price",
                        ],
                        "price_plan" => [
                            "id",
                            "name",
                            "annotations_count",
                            "price",
                            "has_manual_add",
                            "has_csv_upload",
                            "has_api",
                            "has_integrations",
                            "has_data_sources",
                            "ga_account_count",
                            "user_per_ga_account_count",
                            "short_description",
                            "is_available",
                            "web_monitor_count",
                            "owm_city_count",
                            "google_alert_keyword_count",
                            "has_notifications",
                            "has_google_data_studio",
                            "has_microsoft_power_bi",
                            "has_chrome_extension",
                            "google_analytics_property_count",
                            "yearly_discount_percent",
                            "badge_text",
                        ]
                    ]
                ]
            ]);
    }
}
