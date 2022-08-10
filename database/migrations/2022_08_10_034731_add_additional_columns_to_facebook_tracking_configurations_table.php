<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalColumnsToFacebookTrackingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('facebook_tracking_configurations', function (Blueprint $table) {
            $table->boolean('is_post_likes_tracking_on')->default(true);
            $table->boolean('is_post_comments_tracking_on')->default(true);
            $table->boolean('is_post_views_tracking_on')->default(true);
            $table->boolean('is_post_shares_tracking_on')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('facebook_tracking_configurations', function (Blueprint $table) {
            $table->dropColumn('is_post_likes_tracking_on');
            $table->dropColumn('is_post_comments_tracking_on');
            $table->dropColumn('is_post_views_tracking_on');
            $table->dropColumn('is_post_shares_tracking_on');
        });
    }
}
