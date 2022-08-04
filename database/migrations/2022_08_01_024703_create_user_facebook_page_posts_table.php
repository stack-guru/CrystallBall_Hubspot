<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserFacebookPagePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_facebook_page_posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_facebook_page_id')->nullable();
            $table->text('title')->nullable();
            $table->text('description')->nullable();
            $table->text('post_url')->nullable();
            $table->string('facebook_post_id', 200)->nullable();
            $table->bigInteger('views_count')->unsigned()->nullable();
            $table->bigInteger('likes_count')->unsigned()->nullable();
            $table->bigInteger('comments_count')->unsigned()->nullable();
            $table->bigInteger('shares_count')->unsigned()->nullable();
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
        Schema::dropIfExists('user_facebook_page_posts');
    }
}
