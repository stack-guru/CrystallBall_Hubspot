<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpenWeatherMapAlertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('open_weather_map_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('sender_name', 100)->nullable()->default(null);
            $table->string('event', 100)->nullable()->default('event_name');
            $table->mediumText('description')->nullable()->default(null);
            $table->date('alert_date')->nullable();
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
        Schema::dropIfExists('open_weather_map_alerts');
    }
}
