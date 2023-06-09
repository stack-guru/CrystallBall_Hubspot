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
        $i = 0;
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->firstOrFail();
            $i++;
        } while (($user->annotations()->count() < 1 || $user->userAnnotationColor()->count() < 1) && $i < 10);

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/chrome-extension/annotations/preview?' . implode("&", [
            'startDate=2001-01-01',
            'endDate=2021-12-31',

            'show_manual_annotations=true',
            'show_csv_annotations=true',
            'show_api_annotations=true',

            'show_website_monitoring=true',
            'show_google_algorithm_updates=true',
            'show_holidays=true',
            'show_retail_marketing_dates=true',
            'show_weather_alerts=true',
            'show_news_alerts=true',
            'show_wordpress_updates=true',

            'google_analytics_property_id=*',
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'annotations' => [
                    '*' => [
                        'category',
                        'event_name',
                        'show_at'
                    ]
                ]
            ])
            ->assertJsonStructure([
                'user_annotation_color' => [
                    'manual',
                    'csv',
                    'api',
                    'holidays',
                    'google_algorithm_updates',
                    'retail_marketings',
                    'weather_alerts',
                    'web_monitors',
                    'wordpress_updates',
                    'google_alerts',
                ]
            ]);
    }

    public function testAnnotationsGETAPITest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->firstOrFail();
        } while ($user->annotations()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/chrome-extension/annotations?' . implode("&", [
            'startDate=2001-01-01',
            'endDate=2030-12-31',
            'show_manual_annotations=true',
            'show_csv_annotations=true',
            'show_api_annotations=true',

            'show_website_monitoring=true',
            'show_google_algorithm_updates=true',
            'show_holidays=true',
            'show_retail_marketing_dates=true',
            'show_weather_alerts=true',
            'show_news_alerts=true',
            'show_wordpress_updates=true',

            'google_analytics_property_id=*',
        ]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'annotations' => [
                    '*' => [
                        '*' => [
                            '*' => [
                                '_id',
                                'category',
                                'eventSource' => [
                                    'type',
                                    'name'
                                ],
                                'url',
                                'description',
                                'title',
                                'highlighted',
                                'publishDate',
                                'type'
                            ]
                        ]
                    ]
                ]
            ]);
    }

    public function testAnnotationsCreateAPITest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->firstOrFail();
        } while ($user->annotations()->count() < 1);

        Passport::actingAs($user);

        $response = $this->postJson('/api/v1/chrome-extension/annotations', [
            'category' => 'Test Category',
            'event_name' => 'Test Event',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'annotation' => [
                    "category",
                    "event_name",
                    "show_at",
                    "user_id",
                    "is_enabled",
                    "added_by",
                    "updated_at",
                    "created_at",
                    "id",
                ]
            ]);
    }

    public function testEventLoggingAPITest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->firstOrFail();
        } while ($user->annotations()->count() < 1);

        Passport::actingAs($user);

        $response = $this->postJson('/api/v1/chrome-extension/log', [
            'event_name' => 'Chrome Extension Event recorded',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success'
            ]);
    }

    public function testGoogleAnalyticsPropertyIndexTest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->firstOrFail();
        } while ($user->annotations()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/chrome-extension/google-analytics-properties');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'google_analytics_properties' => [
                    '*' => [
                        "id",
                        "name",
                        "google_account" => [
                            "id",
                            "name",
                        ]
                    ]
                ]
            ]);
    }
}
