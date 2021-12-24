<?php

namespace Tests\Feature;

use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class MicrosoftPowerBIAPITest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testFetchAnnotationsAPITest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_microsoft_power_bi', true)->first()->id)->inRandomOrder()->first();
        } while (count($user->annotations) < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/microsoft-power-bi/annotations?' . implode("&", [
            'startDate=2021-01-01',
            'endDate=2021-12-31',
            'show_manual_annotations=true',
            'show_csv_annotations=true',
            'show_api_annotations=true',
        ]));

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotations')
                        ->has('annotations.0', function ($json) {
                            $json->has('added_by')
                                ->has("is_enabled")
                                ->has("show_at")
                                ->has("created_at")
                                ->has("id")
                                ->has("category")
                                ->has("event_name")
                                ->has("url")
                                ->has("description")
                                ->has("user_name")
                                // ->has("annotation_ga_property_id")
                                // ->has("google_analytics_property_name")
                                ->etc();
                        });
                }
            );
    }
}
