<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AnalyticsDashboardPageTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testUserViewsAnnotationsPage()
    {

        $response = $this->actingAs(User::inRandomOrder()->first(), 'web')->get('/dashboard/analytics');

        $response->assertStatus(200);
    }

    public function testAnnotationMetricsDimensionsAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/analytics/annotations-metrics-dimensions', [
            'start_date' => '2005-01-02',
            'end_date' => '2021-01-01',
        ]);

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
                                ->has("sum_conversions_count")
                                ->has("statistics_date")
                                ->etc();
                        });
                }
            );
    }

    public function testUsersDaysAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/analytics/users-days', [
            'start_date' => '2005-01-02',
            'end_date' => '2021-01-01',
        ]);

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

    public function testUsersDaysAnnotationsAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/analytics/users-days-annotations', [
            'start_date' => '2005-01-02',
            'end_date' => '2021-01-01',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('statistics_date')
                                ->has("sum_users_count")
                                ->has("event_name")
                                ->has("category")
                                ->has("show_at")
                                ->has("description")
                                ->has("seven_day_old_date")
                                ->etc();
                        });
                }
            );
    }

    public function testMediaAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/analytics/media', [
            'start_date' => '2005-01-02',
            'end_date' => '2021-01-01',
        ]);

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

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/analytics/sources', [
            'start_date' => '2005-01-02',
            'end_date' => '2021-01-01',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('source_name')
                                ->has("sum_users_count")
                                ->has("sum_events_count")
                                ->has("sum_conversions_count")
                                ->etc();
                        });
                }
            );
    }

    public function testDevicesAPITest()
    {

        $response = $this->actingAs(User::inRandomOrder()->first())->getJson('/ui/dashboard/analytics/device-categories', [
            'start_date' => '2005-01-02',
            'end_date' => '2021-01-01',
        ]);

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('statistics')
                        ->has('statistics.0', function ($json) {
                            $json->has('device_category')
                                ->has("sum_users_count")
                                ->has("sum_events_count")
                                ->has("sum_conversions_count")
                                ->etc();
                        });
                }
            );
    }
}
