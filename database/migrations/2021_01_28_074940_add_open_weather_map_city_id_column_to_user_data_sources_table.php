<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOpenWeatherMapCityIdColumnToUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->foreignId('open_weather_map_city_id')->onDelete('CASCASE')->nullable()->default(null)->constrained();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->dropForeign('user_data_sources_open_weather_map_city_id_foreign');
            $table->dropColumn('open_weather_map_city_id');
        });
    }
}
