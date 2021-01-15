<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserGaAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_ga_accounts', function (Blueprint $table) {
            $table->id();

            $table->foreignId("user_id")->nullable()->onDelete('CASCADE')->constrained();
            $table->foreignId("google_analytics_account_id")->nullable()->onDelete('CASCADE')->constrained();

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
        Schema::dropIfExists('user_ga_accounts');
    }
}
