<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Services\DataForSeoService;
use Illuminate\Database\Seeder;

class DataForSeoLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $locations = (new DataForSeoService())->getLocations();
        dd($locations);
        if (is_array($locations) && !empty($locations)) {
            foreach ($locations as $location) {
                Location::create([
                    'location_name' => $location['location_name'] ?? null,
                    'location_code' => $location['location_code'] ?? null,
                    'location_code_parent' => $location['location_code_parent'] ?? null,
                    'country_iso_code' => $location['country_iso_code'] ?? null,
                    'location_type' => $location['location_type'] ?? null,
                ]);
            }
        }
    }
}
