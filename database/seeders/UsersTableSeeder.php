<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\PricePlan;

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
        DB::table('users')->insert([
            'name' => 'ABC',
            'email' =>'abc@def.gh',
            'password' => bcrypt('password'),
            'price_plan_id' => PricePlan::where('price', 0.00)->where('is_enabled', true)->first()->id,
            'price_plan_expiry_date' => new \DateTime("+1 month"),
        ]);
    }
}
