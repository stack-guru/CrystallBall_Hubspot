<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeAwsLinkedinAndTwitterFieldsTypeToPricePlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->string('aws_credits_count')->nullable()->change();
            $table->string('linkedin_credits_count')->nullable()->change();
            $table->string('twitter_credits_count')->nullable()->change();
            $table->string('bitbucket_credits_count')->nullable()->change();
            $table->string('github_credits_count')->nullable()->change();
            $table->string('apple_podcast_monitor_count')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->unsignedBigInteger('aws_credits_count')->nullable()->change();
            $table->unsignedBigInteger('linkedin_credits_count')->nullable()->change();
            $table->unsignedBigInteger('twitter_credits_count')->nullable()->change();
            $table->unsignedBigInteger('bitbucket_credits_count')->nullable()->change();
            $table->unsignedBigInteger('github_credits_count')->nullable()->change();
            $table->integer('apple_podcast_monitor_count')->unsigned()->required()->default(0)->change();
        });
    }
}
