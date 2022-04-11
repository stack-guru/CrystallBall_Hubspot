<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class APIEventSourceList extends TestCase
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

        $response = $this->getJson('/api/v1/event-sources');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'eventSources' => [
                    '*' => [
                        "_id",
                        "name",
                        "type",
                        "scope",
                        "categories"
                    ]
                ]
            ]);
    }
}
