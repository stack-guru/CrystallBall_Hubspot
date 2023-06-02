<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateYoutubeMonitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('youtube_monitors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->default(null);
            $table->mediumText('url')->required();
            $table->mediumText('feed_url')->nullable();
            $table->dateTime('last_synced_at')->nullable();
            $table->bigInteger('ga_property_id')->nullable();

            $table->boolean('old_videos_uploaded')->default(true);
            $table->boolean('new_videos_uploaded')->default(true);

            $table->bigInteger('when_video_reach_likes')->unsigned()->default(1000);
            $table->boolean('is_video_likes_tracking_on')->default(true);

            $table->bigInteger('when_video_reach_comments')->unsigned()->default(1000);
            $table->boolean('is_video_comments_tracking_on')->default(true);

            $table->bigInteger('when_video_reach_views')->unsigned()->default(1000);
            $table->boolean('is_video_views_tracking_on')->default(true);

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
        Schema::dropIfExists('youtube_monitors');
    }
}
