<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplePodcastMonitors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apple_podcast_monitors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->default(null);
            $table->mediumText('url')->required();
            $table->mediumText('feed_url')->required();
            $table->dateTime('last_synced_at')->nullable();
            $table->bigInteger('ga_property_id')->nullable();
            $table->foreignId("user_id")->required()->constrained()->onDelete('CASCADE');
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
        Schema::dropIfExists('apple_podcast_monitors');
    }
}
