<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\PricePlan;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ZapierAPITest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testAnnotationsGETAPITest()
    {
        $pricePlanId = PricePlan::where('has_api', true)->first()->id;
        do {
            $user = User::inRandomOrder()->firstOrFail();
        } while (count($user->annotations) < 1);
        $user->price_plan_id = $pricePlanId;

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/zapier/annotations', [
            'startDate' => '2001-01-01',
            'endDate' => '2030-01-01',
            'show_manual_annotations' => 'true',
            'show_csv_annotations' => 'true',
            'show_api_annotations' => 'true',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->first(function ($json) {
                        $json->has('show_at')
                            ->has("id")
                            ->has("category")
                            ->has("event_name")
                            ->has("url")
                            ->has("description")
                            ->etc();
                    });
                }
            );
    }

    public function testAnnotationCreateAPITest()
    {
        $user = User::inRandomOrder()->first();
        if ($user->isPricePlanAnnotationLimitReached(true)) {
            $annotationsCount = $user->annotations()->count();
            $user->annotations()->limit($annotationsCount - $user->pricePlan->annotations_count)->delete();
            $annotationsCount = $user->annotations()->count();
            if ($user->pricePlan->annotations_count == $annotationsCount) {
                $user->annotations()->limit(round($annotationsCount / 2))->delete();
            }
        }
        Passport::actingAs($user);

        $response = $this->postJson('/api/v1/zapier/annotations', [
            'category' => 'test annotation',
            'event_name' => 'zapier api tested',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotation', function ($json) {
                        $json->has('added_by')
                            ->has("is_enabled")
                            ->has("show_at")
                            ->has("created_at")
                            ->has("id")
                            ->has("category")
                            ->has("event_name")
                            // ->has("url")
                            // ->has("description")
                            // ->has("user_name")
                            // ->has("annotation_ga_property_id")
                            // ->has("google_analytics_property_name")
                            ->etc();
                    });
                }
            );
    }
}
