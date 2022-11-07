<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SpotifyAnnotatios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('spotify_annotations', function (Blueprint $table) {
            $table->id();
            $table->string("category")->nullable();
            $table->string("event")->nullable();
            $table->longText("description")->nullable();
            $table->string("url")->nullable();
            $table->date("podcast_date")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('spotify_annotations');

    }
}
