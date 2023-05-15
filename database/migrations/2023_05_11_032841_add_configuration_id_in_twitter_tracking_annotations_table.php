<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConfigurationIdInTwitterTrackingAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('twitter_tracking_annotations', function (Blueprint $table) {
            $table->integer('configuration_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('twitter_tracking_annotations', function (Blueprint $table) {
            $table->dropColumn('configuration_id');
        });
    }
}
