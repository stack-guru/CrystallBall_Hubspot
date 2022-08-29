<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstagramAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('instagram_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('instagram_account_id')->nullable();
            $table->unsignedBigInteger('user_facebook_page_id')->nullable();
            $table->string('name', 255)->nullable();
            $table->text('token')->nullable();
            $table->string('token_expires_at', 100)->nullable();
            $table->string('instagram_user_email', 100)->nullable();
            $table->string('instagram_avatar_url', 150)->nullable();
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
        Schema::dropIfExists('instagram_accounts');
    }
}
