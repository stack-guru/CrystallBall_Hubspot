<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class WebMonitorsListTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testWebMonitorsList()
    {
        // do {
            $user = User::inRandomOrder()->firstOrFail();
        // } while ($user->webMonitors()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/ui/data-source/web-monitor');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'web_monitors' => [
                    '*' => [
                        "name",
                        "url",
                        "email_address",
                        "sms_phone_number",
                        "ga_property_id",
                        "user_id",
                        "uptime_robot_id",
                        "updated_at",
                        "created_at",
                        "id",
                        "google_analytics_property",
                    ]
                ]
            ]);
    }
}
