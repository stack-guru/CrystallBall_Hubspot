<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacebookTrackingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facebook_tracking_configurations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->boolean('when_new_post_on_facebook')->default(true);
            $table->boolean('when_new_ad_compaign_launched')->default(true);
            $table->boolean('when_ad_compaign_ended')->default(true);
            $table->boolean('when_changes_on_ad_compaign')->default(true);
            $table->bigInteger('when_post_reach_likes')->unsigned()->default(1000);
            $table->bigInteger('when_post_reach_comments')->unsigned()->default(1000);
            $table->bigInteger('when_post_reach_shares')->unsigned()->default(1000);
            $table->bigInteger('when_post_reach_views')->unsigned()->default(1000);
            $table->text('selected_pages');
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
        Schema::dropIfExists('facebook_tracking_configurations');
    }
}
