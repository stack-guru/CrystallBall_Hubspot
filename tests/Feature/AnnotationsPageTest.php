<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\AssertableJson;

class AnnotationsPageTest extends TestCase
{
    public function testUserViewsAnnotationsPage()
    {

        $response = $this->actingAs(User::inRandomOrder()->first(), 'web')->get('/annotation');

        $response->assertStatus(200);
    }

    public function testAnnotationTableAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/annotation');

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

    public function testAnnotationCategoryAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/annotation-categories');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('categories')
                        ->has('categories.0', function ($json) {
                            $json->has('category')
                                ->etc();
                        });
                }
            );
    }
}
