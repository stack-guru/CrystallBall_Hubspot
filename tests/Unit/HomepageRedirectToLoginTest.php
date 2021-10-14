<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageRedirectToLoginTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testHomepageRedirectToLoginTest()
    {
        $response = $this->get('/');

        $response->assertStatus(301)
            ->assertHeader('Location', "/login");
    }
}
