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

        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->googleAnalyticsProperties) < 1 || count($user->annotations) < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/annotations-metrics-dimensions?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
            'statistics_padding_days=0'
        ]));

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotations')
                        ->has('annotations.0', function ($json) {
                            $json->has('event_name')
                                ->has("category")
                                ->has("show_at")
                                ->has("description")
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

        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->googleAnalyticsProperties) < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/users-days?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

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

        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->googleAnalyticsProperties) < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/users-days-annotations?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
            'statistics_padding_days=' . 0
        ]));

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

        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->googleAnalyticsProperties) < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/media?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

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
        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->googleAnalyticsProperties) < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/sources?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

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

        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->googleAnalyticsProperties) < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/device-categories?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

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
