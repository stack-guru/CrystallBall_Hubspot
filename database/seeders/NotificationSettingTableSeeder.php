<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\NotificationSetting;

class NotificationSettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::select('users.id')
            ->leftJoin('notification_settings', 'users.id', 'notification_settings.user_id')
            ->whereNull('notification_settings.id')
            ->distinct()
            ->get();

        info(count($users) . " users found to be seeded.");

        $registerController = new \App\Http\Controllers\Auth\RegisterController;
        foreach($users as $user){
            $registerController->seedNotificationSetting($user);
        }
        info("Seeding completed!");
    }
}
