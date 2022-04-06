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
        } while ($user->googleAnalyticsProperties()->count() < 1 || $user->annotations()->count() < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/annotations-metrics-dimensions?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
            'statistics_padding_days=0'
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'annotations' => [
                    '*' => [
                        'event_name',
                        'category',
                        'show_at',
                        'description',
                        'seven_day_old_date',
                        'sum_users_count',
                        'sum_sessions_count',
                        'sum_events_count',
                        'sum_conversions_count',
                        'statistics_date',
                    ]
                ]
            ]);
    }

    public function testUsersDaysAPITest()
    {

        do {
            $user = User::inRandomOrder()->first();
        } while ($user->googleAnalyticsProperties()->count() < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/users-days?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    '*' => [
                        'statistics_date',
                        'sum_users_count',
                    ]
                ]
            ]);
    }

    public function testUsersDaysAnnotationsAPITest()
    {

        do {
            $user = User::inRandomOrder()->first();
        } while ($user->googleAnalyticsProperties()->count() < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/users-days-annotations?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
            'statistics_padding_days=' . 0
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    '*' => [
                        'statistics_date',
                        'sum_users_count',
                        'event_name',
                        'category',
                        'show_at',
                        'description',
                        'seven_day_old_date',
                    ]
                ]
            ]);
    }

    public function testMediaAPITest()
    {

        do {
            $user = User::inRandomOrder()->first();
        } while ($user->googleAnalyticsProperties()->count() < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/media?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    '*' => [
                        'medium_name',
                        'sum_users_count',
                    ]
                ]
            ]);
    }

    public function testSourcesAPITest()
    {
        do {
            $user = User::inRandomOrder()->first();
        } while ($user->googleAnalyticsProperties()->count() < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/sources?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    '*' => [
                        'source_name',
                        'sum_users_count',
                        'sum_events_count',
                        'sum_conversions_count',
                    ]
                ]
            ]);
    }

    public function testDevicesAPITest()
    {

        do {
            $user = User::inRandomOrder()->first();
        } while ($user->googleAnalyticsProperties()->count() < 1);

        $response = $this->actingAs($user)->getJson('/ui/dashboard/analytics/device-categories?' . implode("&", [
            'start_date=2005-01-02',
            'end_date=2021-01-01',
            'ga_property_id=' . $user->googleAnalyticsProperties[0]->id,
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    '*' => [
                        'device_category',
                        'sum_users_count',
                        'sum_events_count',
                        'sum_conversions_count',
                    ]
                ]
            ]);
    }
}
