<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTwitterTrackingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('twitter_tracking_configurations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');

            $table->tinyInteger('is_tweets_likes_tracking_on')->default(0);
            $table->integer('when_tweet_reach_likes')->default(0);

            $table->tinyInteger('is_tweets_retweets_tracking_on')->default(0);
            $table->integer('when_tweet_reach_retweets')->default(0);

            $table->timestamps();

            $table->index(['user_id']);
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
        Schema::dropIfExists('twitter_tracking_configurations');
    }
}
