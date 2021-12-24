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

        do {
            $user = User::inRandomOrder()->first();
        } while (count($user->userChecklistItems) < 1);

        $response = $this->actingAs($user, 'web')->getJson('/ui/user-checklist-item');

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
                                ->has('checklist_item', function ($json) {
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
