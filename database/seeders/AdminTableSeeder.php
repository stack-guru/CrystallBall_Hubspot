<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class AdminTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
            'name' => 'ABC',
            'email' =>'abc@def.gh',
            'password' => bcrypt('password'),
        ]);
    }
}
