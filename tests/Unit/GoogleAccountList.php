<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class GoogleAccountList extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testAPIEventSourceList()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_api', true)->first()->id)->inRandomOrder()->firstOrFail();
        } while ($user->annotations()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/ui/settings/google-account');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'google_accounts' => [
                    '*' => [
                        "id",
                        "expires_in",
                        "account_id",
                        "nick_name",
                        "name",
                        "email",
                        "avatar",
                        "user_id",
                        "created_at",
                        "updated_at",
                        "adwords_client_customer_id",
                        "scopes",
                        "state",
                        "last_successful_use_at",
                        "last_unsuccessful_use_at",
                    ]
                ]
            ]);
    }
}
