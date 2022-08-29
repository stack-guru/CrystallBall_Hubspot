<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstagramPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('instagram_posts', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('instagram_account_id')->nullable();
            $table->string('instagram_post_id', 200)->nullable();
            
            $table->text('title')->nullable();
            $table->text('description')->nullable();
            $table->text('post_url')->nullable();

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
        Schema::dropIfExists('instagram_posts');
    }
}
