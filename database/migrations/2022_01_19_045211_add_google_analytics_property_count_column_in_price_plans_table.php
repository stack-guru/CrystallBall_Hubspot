<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGoogleAnalyticsPropertyCountColumnInPricePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->integer('google_analytics_property_count')->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->dropColumn('google_analytics_property_count');
        });
    }
}
