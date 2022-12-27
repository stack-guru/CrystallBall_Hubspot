<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddApplePodcastInUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->bigInteger('apple_podcast_annotation_id')->nullable()->unsigned();
        });
        
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->foreign('apple_podcast_annotation_id')->references('id')->on('apple_podcast_annotations');
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
            $table->dropForeign('apple_podcast_annotation_id', ['apple_podcast_annotation_id']);
        });
    }
}
