<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGaPropertyIdToWebMonitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('web_monitors', function (Blueprint $table) {
            $table->unsignedBigInteger('ga_property_id')->nullable();
            $table->foreign('ga_property_id')->references('id')->on('google_analytics_properties');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('web_monitors', function (Blueprint $table) {
            $table->dropForeign(['ga_property_id']);
        });
    }
}
