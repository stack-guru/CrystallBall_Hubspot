<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGaPropertyIdInTwitterTrackingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('twitter_tracking_configurations', function (Blueprint $table) {
            $table->integer('ga_property_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('twitter_tracking_configurations', function (Blueprint $table) {
            $table->dropColumn('ga_property_id');
            
        });
    }
}
