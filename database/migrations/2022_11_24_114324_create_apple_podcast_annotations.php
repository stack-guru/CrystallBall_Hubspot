<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplePodcastAnnotations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apple_podcast_annotations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->required()->unsigned();
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
        Schema::dropIfExists('apple_podcast_annotations');
    }
}
