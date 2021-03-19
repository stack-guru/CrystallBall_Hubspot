<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdwordsKeywordPerformancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('adwords_keyword_performances', function (Blueprint $table) {
            $table->id();

            $table->date('fetched_at')->required();

            $table->bigInteger('campaign_id')->unsigned()->nullable();
            $table->bigInteger('ad_group_id')->unsigned()->nullable();
            $table->bigInteger('keyword_id')->unsigned()->nullable();

            $table->string('campaign_name', 100)->nullable();
            $table->string('ad_group_name', 100)->nullable();
            $table->string('keyword_name', 100)->nullable();

            $table->bigInteger('clicks')->unsigned()->nullable();

            $table->bigInteger('google_account_id')->unsigned();
            $table->foreign('google_account_id')->references('id')->on('google_accounts')->onUpdate('CASCADE')->onDelete('CASCADE');

            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('adwords_keyword_performances');
    }
}
