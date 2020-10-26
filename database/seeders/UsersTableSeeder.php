<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
            'name' => 'developers',
            'email' =>'developers786@test.com',
            'password' => Hash::make('123456aB'),
        ]);
    }
}
