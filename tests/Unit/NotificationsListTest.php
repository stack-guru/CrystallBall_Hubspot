<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class NotificationListTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testNotificationsList()
    {
        do {
            $user = User::inRandomOrder()->firstOrFail();
        } while ($user->notificationSettings()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/ui/notification-setting');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'notification_settings' => [
                    '*' => [
                        "id",
                        "is_enabled",
                        "name",
                        "label",
                        "email_seven_days_before",
                        "email_one_days_before",
                        "email_on_event_day",
                        "browser_notification_on_event_day",
                        "sms_on_event_day",
                        "user_id",
                    ]
                ]
            ]);
    }
}
