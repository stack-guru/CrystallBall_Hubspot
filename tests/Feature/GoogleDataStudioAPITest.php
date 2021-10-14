<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\PricePlan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;

class GoogleDataStudioAPITest extends TestCase
{
    
    public function testFetchAnnotationsAPITest()
    {
        ;
        Passport::actingAs(User::where('price_plan_id', PricePlan::where('has_google_data_studio', true)->first()->id)->inRandomOrder()->first());

        $response = $this->getJson(implode([
            'https://app.gaannotations.com',
            '/api/v1/google-data-studio/annotations',
            '?',
            'startDate=2001-01-01',
            '&endDate=2030-01-01',
            '&show_manual_annotations=true',
            '&show_csv_annotations=true',
            '&show_api_annotations=true',
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
                                ->has("annotation_ga_property_id")
                                ->has("google_analytics_property_name")
                                ->etc();
                        });
                }
            );
    }

}
