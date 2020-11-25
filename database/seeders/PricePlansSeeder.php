<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Seeder;

class PricePlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('price_plans')->insert(
            [
                'name' => 'Free',
                'annotations_count' => "0",
                'price' => "0",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => false,
                'is_enabled' => true,
                'has_integrations'=>0,
                'has_data_sources'=>0
            ]
        );
        DB::table('price_plans')->insert(
            [
                'name' => 'Premium',
                'annotations_count' => "0",
                'price' => "19.00",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => true,
                'is_enabled' => true,
                'has_integrations'=>0,
                'has_data_sources'=>0
            ]
        );
    }
}
