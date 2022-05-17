<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Add3NewColumnsForDataSourceInUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_ds_g_ads_history_change_enabled')->after('is_ds_weather_alerts_enabled')->nullable()->default(false);
            $table->boolean('is_ds_anomolies_detection_enabled')->after('is_ds_g_ads_history_change_enabled')->nullable()->default(false);
            $table->boolean('is_ds_budget_tracking_enabled')->after('is_ds_anomolies_detection_enabled')->nullable()->default(false);
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
            $table->dropColumn('is_ds_g_ads_history_change_enabled');
            $table->dropColumn('is_ds_anomolies_detection_enabled');
            $table->dropColumn('is_ds_budget_tracking_enabled');
        });
    }
}
