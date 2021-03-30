<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAlertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_alerts', function (Blueprint $table) {
            $table->id();

            $table->string('category', 100)->nullable()->default(null);
            $table->mediumText('image')->nullable()->default(null);
            $table->mediumText('title')->nullable()->default(null);
            $table->mediumText('url')->nullable()->default(null);
            $table->mediumText('description')->nullable()->default(null);
            $table->string('tag_name', '50')->nullable();

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
        Schema::dropIfExists('google_alerts');
    }
}
