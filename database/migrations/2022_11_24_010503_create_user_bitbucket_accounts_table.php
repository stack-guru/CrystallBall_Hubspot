<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserBitbucketAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_bitbucket_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('name', 255)->nullable();
            $table->text('token')->nullable();
            $table->string('token_expires_at', 100)->nullable();
            $table->string('bitbucket_account_id', 200)->nullable();
            $table->string('bitbucket_user_email', 100)->nullable();
            $table->string('bitbucket_avatar_url', 255)->nullable();
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
        Schema::dropIfExists('user_bitbucket_accounts');
    }
}
