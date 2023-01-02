<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTwitterTrackingAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('twitter_tracking_annotations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('category')->default('Twitter');
            $table->string('event_type')->default('Alert');
            $table->string('event_name');
            $table->mediumText('url');
            $table->mediumText('description');
            $table->string('title');
            $table->date('show_at');
            $table->string('tweet_id');
            $table->timestamps();

            $table->index(['user_id', 'tweet_id']);
            $table->foreign('user_id')->on('users')->references('id')->onDelete("CASCADE");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('twitter_tracking_annotations');
    }
}
