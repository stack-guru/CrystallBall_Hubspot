<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpectatorTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('spectators')->insert([
            'name' => 'ABC',
            'email' =>'abc@def.gh',
            'password' => bcrypt('password'),
        ]);
    }
}
