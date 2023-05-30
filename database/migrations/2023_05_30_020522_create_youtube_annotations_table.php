<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateYoutubeAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('youtube_annotations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->required()->unsigned();
            $table->bigInteger("monitor_id")->nullable();
            $table->string("category")->nullable();
            $table->string("event")->nullable();
            $table->longText("description")->nullable();
            $table->string("url")->nullable();
            $table->date("date")->nullable();
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
        Schema::dropIfExists('youtube_annotations');
    }
}
