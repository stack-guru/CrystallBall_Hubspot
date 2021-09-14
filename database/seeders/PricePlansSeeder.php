<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
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
                'short_description' => ".",
                'annotations_count' => "0",
                'price' => "0",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => false,
                'is_enabled' => true,
                'has_integrations' => 0,
                'has_data_sources' => 0,
            ]
        );
        DB::table('price_plans')->insert(
            [
                'name' => 'Basic',
                'short_description' => ".",
                'annotations_count' => "0",
                'price' => "19.00",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => true,
                'is_enabled' => true,
                'has_integrations' => 0,
                'has_data_sources' => 0,
            ]
        );
        DB::table('price_plans')->insert(
            [
                'name' => 'Pro',
                'short_description' => ".",
                'annotations_count' => "0",
                'price' => "99.00",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => true,
                'is_enabled' => true,
                'has_integrations' => 1,
                'has_data_sources' => 1,
            ]
        );

        DB::table('price_plans')->insert(
            [
                'name' => 'Trial',
                'short_description' => ".",
                'annotations_count' => "0",
                'price' => "0",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => true,
                'is_enabled' => false,
                'has_integrations' => 1,
                'has_data_sources' => 1,
            ]
        );
    }
}
