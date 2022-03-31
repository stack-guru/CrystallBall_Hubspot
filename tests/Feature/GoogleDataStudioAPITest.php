<?php

namespace Tests\Feature;

use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class GoogleDataStudioAPITest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testFetchAnnotationsAPITest()
    {

        $pricePlanId = PricePlan::where('has_microsoft_power_bi', true)->first()->id;
        do {
            $user = User::inRandomOrder()->firstOrFail();
        } while (count($user->annotations) < 1);
        $user->price_plan_id = $pricePlanId;

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/google-data-studio/annotations?' . implode("&", [
            'startDate=2001-01-01',
            'endDate=2021-12-31',
            'show_manual_annotations=true',
            'show_csv_annotations=true',
            'show_api_annotations=true',
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'annotations' => [
                    '*' => [
                        'added_by',
                        'is_enabled',
                        'show_at',
                        'created_at',
                        'id',
                        'category',
                        'event_name',
                        'url',
                        'description',
                        'user_name',
                        'annotation_ga_property_id',
                        'google_analytics_property_name',
                    ]
                ]
            ]);
    }
}
