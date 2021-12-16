<?php

namespace Tests\Feature;

use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ChromeExtensionAPITest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testAnnotationsPreviewAPITest()
    {
        Passport::actingAs(User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->first());

        $response = $this->getJson('/api/v1/chrome-extension/annotations/preview', [
            'startDate' => '2001-01-01',
            'endDate' => '2030-01-01',
            'show_manual_annotations' => 'true',
            'show_csv_annotations' => 'true',
            'show_api_annotations' => 'true',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotations')
                        ->has('annotations.0', function ($json) {
                            $json->has("category")
                                ->has("show_at")
                                ->has("event_name")
                                ->etc();
                        });
                }
            );
    }

    public function testAnnotationsGETAPITest()
    {
        Passport::actingAs(User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->first());

        $response = $this->getJson('/api/v1/chrome-extension/annotations', [
            'startDate' => '2001-01-01',
            'endDate' => '2030-01-01',
            'show_manual_annotations' => 'true',
            'show_csv_annotations' => 'true',
            'show_api_annotations' => 'true',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotations')
                        ->has('annotations.0', function ($json) {
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

}
