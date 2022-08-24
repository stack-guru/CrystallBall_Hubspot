<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstagramTrackingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('instagram_tracking_configurations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->boolean('when_new_post_on_instagram')->default(true);
            $table->bigInteger('when_post_reach_likes')->unsigned()->default(1000);
            $table->bigInteger('when_post_reach_comments')->unsigned()->default(1000);
            $table->bigInteger('when_post_reach_shares')->unsigned()->default(1000);
            $table->bigInteger('when_post_reach_views')->unsigned()->default(1000);
            $table->boolean('is_post_likes_tracking_on')->default(true);
            $table->boolean('is_post_comments_tracking_on')->default(true);
            $table->boolean('is_post_views_tracking_on')->default(true);
            $table->boolean('is_post_shares_tracking_on')->default(true);
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
        Schema::dropIfExists('instagram_tracking_configurations');
    }
}
