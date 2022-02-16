<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleSearchConsoleStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_search_console_statistics', function (Blueprint $table) {
            $table->id();

            $table->date('statistics_date')->required();
            $table->mediumText('query')->nullable()->default(null);
            $table->mediumText('page')->nullable()->default(null);
            $table->string('country')->nullable()->default(null);
            $table->string('device')->nullable()->default(null);
            $table->mediumText('search_appearance')->nullable()->default(null);

            $table->integer('clicks_count')->unsigned()->nullable()->default(null);
            $table->integer('impressions_count')->unsigned()->nullable()->default(null);
            $table->integer('ctr_count')->unsigned()->nullable()->default(null); // Click-through rate
            $table->integer('position_rank')->unsigned()->nullable()->default(null);

            $table->unsignedBigInteger('google_search_console_site_id')->required();
            $table->foreign('google_search_console_site_id', 'gsc_statistics_gsc_site_id_foreign')->references('id')->on('google_search_console_sites')->onDelete('CASCADE');

            $table->unsignedBigInteger('google_account_id')->required();
            $table->foreign('google_account_id')->references('id')->on('google_accounts')->onDelete('CASCADE');

            $table->unsignedBigInteger('user_id')->required();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE');

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
        Schema::dropIfExists('google_search_console_statistics');
    }
}
