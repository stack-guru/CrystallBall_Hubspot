<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpenWeatherMapCitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // "id": 8197383,
        // "name": "Bungatira",
        // "state": "",
        // "country": "UG",
        // "coord": {
            //     "lon": 32.287811,
            //     "lat": 2.83018
            // }
            
        Schema::create('open_weather_map_cities', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('owmc_id')->unsigned()->nullable()->default(null);
            $table->string('name', 100)->nullable()->default(null);
            $table->string('state_name', 50)->nullable()->default(null);
            $table->string('country_code', 5)->nullable()->default(null);
            $table->string('country_name', 60)->nullable()->default(null);
            $table->string('longitude', 25)->nullable()->default(null);
            $table->string('latitude', 25)->nullable()->default(null);
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('open_weather_map_cities');
    }
}
