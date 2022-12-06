<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::firstOrCreate([
            'name'   => 'price-plan-subscription',
            'source' => 'Payment History',
        ]);

        Permission::firstOrCreate([
            'name'   => 'auto-payment-log',
            'source' => 'Payment Log',
        ]);

        Permission::firstOrCreate([
            'name'   => 'user-active-report',
            'source' => 'Active User Report',
        ]);
    }
}
