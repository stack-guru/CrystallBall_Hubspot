<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddApplePodcastMonitorCountToPricePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->integer('apple_podcast_monitor_count')->unsigned()->required()->default(0);
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
            $table->dropColumn('apple_podcast_monitor_count');
        });
    }
}
