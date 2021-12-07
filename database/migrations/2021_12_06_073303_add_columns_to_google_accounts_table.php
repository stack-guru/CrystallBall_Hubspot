<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToGoogleAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_accounts', function (Blueprint $table) {
            $table->timestamp('last_successful_use_at')->nullable()->default(null);
            $table->timestamp('last_unsuccessful_use_at')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('google_accounts', function (Blueprint $table) {
            $table->dropColumn(['last_successful_use_at', 'last_unsuccessful_use_at']);
        });
    }
}
