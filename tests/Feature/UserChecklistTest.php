<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserChecklistTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    public function testFetchChecklistItemsTest()
    {
        $response = $this->actingAs(User::inRandomOrder()->first(), 'web')->getJson('/ui/user-checklist-item');

        $response->assertStatus(200)
            ->assertJson(
                function (AssertableJson $json) {
                    $json->has('user_checklist_items')
                        ->has('user_checklist_items.0', function ($json) {
                            $json->has("id")
                                ->has("checklist_item_id")
                                ->has("last_viewed_at")
                                ->has("completed_at")
                                ->has("user_id")
                                ->has("created_at")
                                ->has("updated_at")
                                ->has("checklist_item")
                                ->has('checklist_item.0', function ($json) {
                                    $json->has("id")
                                        ->has("name")
                                        ->has("label")
                                        ->has("description")
                                        ->has("url")
                                        ->has("sort_rank")
                                        ->etc();
                                })
                                ->etc();
                        });
                }
            );
    }
}
