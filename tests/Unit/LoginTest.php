<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LoginTest extends TestCase
{
    // use RefreshDatabase;
    // public $seed = true;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testLoginTest()
    {
        $response = $this->post('/login', ['email' => 'abc@def.gh', 'password' => 'password']);

        $response->assertStatus(302)
            ->assertHeader('Location', route('annotation.index'));
    }
}
