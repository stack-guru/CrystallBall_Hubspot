<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

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
                'annotations_count' => "0",
                'price' => "0",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => false,
                'is_enabled' => true,
            ],
            [
                'annotations_count' => "0",
                'price' => "19.00",
                'has_manual_add' => true,
                'has_csv_upload' => true,
                'has_api' => true,
                'is_enabled' => true,
            ]
        );
    }
}
