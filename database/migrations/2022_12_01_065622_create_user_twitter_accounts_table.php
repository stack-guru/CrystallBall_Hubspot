<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTwitterAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_twitter_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->text('email')->nullable();
            $table->text('avatar')->nullable();
            $table->text('avatar_original')->nullable();
            $table->string('nickname');
            $table->string('name');
            $table->text('token');
            $table->text('token_secret');
            $table->json("payload");
            $table->string('account_id')->virtualAs("json_unquote(json_extract(payload, '$.id_str'))");
            $table->timestamps();

            $table->index(['user_id']);
            $table->foreign('user_id')->on('users')->references('id')->onDelete("CASCADE");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_twitter_accounts');
    }
}
