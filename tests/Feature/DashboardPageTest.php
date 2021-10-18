<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DashboardPageTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testUserViewsAnnotationsPage()
    {

        $response = $this->actingAs(User::inRandomOrder()->first(), 'web')->get('/dashboard');

        $response->assertStatus(200);
    }

    public function testAnnotationMetricsDimensionsAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/annotations-metrics-dimensions?start_date=2005-01-02&end_date=2021-01-01');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotations')
                        ->has('annotations.0', function ($json) {
                            $json->has('event_name')
                                ->has("category")
                                ->has("show_at")
                                ->has("seven_day_old_date")
                                ->has("sum_users_count")
                                ->has("sum_sessions_count")
                                ->has("sum_events_count")
                                ->has("statistics_date")
                                ->etc();
                        });
                }
            );
    }

    public function testUsersDaysAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/users-days?start_date=2005-01-02&end_date=2021-01-01');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('statistics_date')
                                ->has("sum_users_count")
                                ->etc();
                        });
                }
            );
    }

    public function testMediaAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/media?start_date=2005-01-02&end_date=2021-01-01');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('medium_name')
                                ->has("sum_users_count")
                                ->etc();
                        });
                }
            );
    }

    public function testSourcesAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/sources?start_date=2005-01-02&end_date=2021-01-01');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('source_name')
                                ->has("sum_users_count")
                                ->has("sum_events_count")
                                ->etc();
                        });
                }
            );
    }

    public function testDevicesAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/device-categories?start_date=2005-01-02&end_date=2021-01-01');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('device_category')
                                ->has("sum_users_count")
                                ->has("sum_events_count")
                                ->etc();
                        });
                }
            );
    }
}
