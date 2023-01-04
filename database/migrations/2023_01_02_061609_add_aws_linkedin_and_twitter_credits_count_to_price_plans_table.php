<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAwsLinkedinAndTwitterCreditsCountToPricePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->unsignedBigInteger('aws_credits_count')->nullable();
            $table->unsignedBigInteger('linkedin_credits_count')->nullable();
            $table->unsignedBigInteger('twitter_credits_count')->nullable();
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
            $table->dropColumn('aws_credits_count');
            $table->dropColumn('linkedin_credits_count');
            $table->dropColumn('twitter_credits_count');
        });
    }
}
