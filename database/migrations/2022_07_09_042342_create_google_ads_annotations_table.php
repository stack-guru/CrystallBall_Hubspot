<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAdsAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_ads_annotations', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('user_id')->required()->unsigned();
            $table->foreign('user_id')->references('id')->on('users');

            $table->bigInteger('google_account_id')->required()->unsigned();
            $table->foreign('google_account_id')->references('id')->on('google_accounts');

            $table->string('title', 100)->required()->default('title');
            $table->string('event_name', 100)->required()->default('event_name');
            $table->string('category', 100)->required()->default('category');
            $table->mediumText('url')->nullable()->default(null);
            $table->mediumText('description')->nullable()->default(null);

            $table->date('detected_at')->required();

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
        Schema::dropIfExists('google_ads_annotations');
    }
}
