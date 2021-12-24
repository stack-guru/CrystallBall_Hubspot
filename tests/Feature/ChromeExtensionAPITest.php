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
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->first();
        } while (count($user->annotations) < 1);

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
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('annotations')
                        ->has('annotations.0', function ($json) {
                            $json->has("category")
                                ->has("show_at")
                                ->has("event_name")
                                ->etc();
                        })
                        ->has('user_annotation_color')
                        ->has('user_annotation_color', function ($json) {
                            $json->has("manual")
                                ->has("csv")
                                ->has("api")
                                ->has("holidays")
                                ->has("google_algorithm_updates")
                                ->has("retail_marketings")
                                ->has("weather_alerts")
                                ->has("web_monitors")
                                ->has("wordpress_updates")
                                ->has("google_alerts")
                                ->etc();
                        });
                }
            );
    }

    public function testAnnotationsGETAPITest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_chrome_extension', true)->first()->id)->inRandomOrder()->first();
        } while (count($user->annotations) < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/chrome-extension/annotations?' . implode("&", [
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
            ->assertJson(
                function (AssertableJson $json) {
                    // $json->has('annotations')
                        // ->has('annotations.0', function ($json) {
                        //     // $json->has('show_at')
                        //     //     ->has("id")
                        //     //     ->has("category")
                        //     //     ->has("event_name")
                        //     //     ->has("url")
                        //     //     ->has("description")
                        //     //     ->etc();
                        // });
                }
            );
    }
}
