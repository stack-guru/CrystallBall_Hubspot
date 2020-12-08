<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDataSourceColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_ds_holidays_enabled')->nullable()->default(false);
            $table->boolean('is_ds_google_algorithm_updates_enabled')->nullable()->default(false);
            $table->boolean('is_ds_weather_alerts_enabled')->nullable()->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_ds_holidays_enabled', 'is_ds_google_algorithm_updates_enabled', 'is_ds_weather_alerts_enabled');
        });
    }
}
