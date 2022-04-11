<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\PricePlan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;


class AnnotationsAPITest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testAnnotationsPreviewAPITest()
    {
        do {
            $user = User::where('price_plan_id', PricePlan::where('has_api', true)->first()->id)->inRandomOrder()->firstOrFail();
        } while ($user->annotations()->count() < 1 || $user->userAnnotationColor()->count() < 1);

        Passport::actingAs($user);

        $response = $this->getJson('/api/v1/annotations');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'annotations' => [
                    '*' => [
                        '_id',
                        'category',
                        'eventSource' => [
                            'name'
                        ],
                        'url',
                        'description',
                        'highlighted',
                        'publishDate',
                    ]
                ]
            ]);
    }
}
