<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use App\Models\PricePlan;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $user = User::create([
            'name' => 'ABC',
            'email' => 'abc@def.gh',
            'password' => bcrypt('password'),
            'price_plan_id' => PricePlan::where('is_enabled', true)->first()->id,
            'price_plan_expiry_date' => new \DateTime("+1 month"),
        ]);
        Auth::loginUsingId($user->id);
        \App\Models\Annotation::factory(50)->create(['user_id' => $user->id]);
    }
}
