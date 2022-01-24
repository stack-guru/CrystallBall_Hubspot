<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use App\Models\PricePlan;
use App\Models\AppSumoApiUser;
use Illuminate\Support\Facades\Hash;

class AppSumoApiUsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $user = AppSumoApiUser::create([
            'username' => 'abc',
            'password' => Hash::make('password'),
        ]);
    }
}
