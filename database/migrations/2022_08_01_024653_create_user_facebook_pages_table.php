<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserFacebookPagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_facebook_pages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_facebook_account_id')->nullable();
            $table->string('facebook_page_name')->nullable();
            $table->string('facebook_page_id', 200)->nullable();
            $table->text('page_access_token')->nullable();
            $table->string('token_expires_at', 100)->nullable();
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
        Schema::dropIfExists('user_facebook_pages');
    }
}
