<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ChangeShopifyTypeInPricePlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->integer('shopify_monitor_count')->default(-1)->change();
            $table->integer('aws_credits_count')->default(-1)->change();
            $table->integer('linkedin_credits_count')->default(-1)->change();
            $table->integer('twitter_credits_count')->default(-1)->change();
            $table->integer('bitbucket_credits_count')->default(-1)->change();
            $table->integer('github_credits_count')->default(-1)->change();
            $table->integer('apple_podcast_monitor_count')->default(-1)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->dropColumn('shopify_monitor_count');
            $table->dropColumn('aws_credits_count');
            $table->dropColumn('linkedin_credits_count');
            $table->dropColumn('twitter_credits_count');
            $table->dropColumn('bitbucket_credits_count');
            $table->dropColumn('github_credits_count');
            $table->dropColumn('apple_podcast_monitor_count');
        });
    }
}
