<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

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
            'price_plan_id' => 1
        ]);
    }
}
