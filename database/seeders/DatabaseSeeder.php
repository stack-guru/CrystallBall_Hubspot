<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call(PricePlansSeeder::class);
        $this->call(ChecklistItemsTableSeeder::class);
        $this->call(AdminTableSeeder::class);
        $this->call(AppSumoApiUsersTableSeeder::class);

        $this->call(UsersTableSeeder::class);
        $users = \App\Models\User::factory(10)->create();
        foreach ($users as $user) {
            Auth::loginUsingId($user->id);
            \App\Models\Annotation::factory(50)->create(['user_id' => $user->id]);
        }

        $this->call(NotificationSettingTableSeeder::class);
        $this->call(DataForSeoLocationSeeder::class);
        $this->call(PermissionSeeder::class);
    }
}
