<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_accounts', function (Blueprint $table) {
            $table->id();

            $table->longText('token')->nullable()->default(null);
            $table->longText('refresh_token')->nullable()->default(null);
            $table->timestamp('expires_in')->nullable();
            $table->string('account_id', 100)->nullable()->default(null);
            $table->string('nick_name', 100)->nullable()->default(null);
            $table->string('name', 100)->nullable()->default(null);
            $table->string('email', 100)->nullable()->default(null);
            $table->string('avatar', 100)->nullable()->default(null);

            $table->foreignId("user_id")->constrained()->required();

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
        Schema::dropIfExists('google_accounts');
    }
}
