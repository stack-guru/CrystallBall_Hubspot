<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRefreshTokenColumnToUserBitbucketAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_bitbucket_accounts', function (Blueprint $table) {
            $table->text('refresh_token')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_bitbucket_accounts', function (Blueprint $table) {
            $table->dropColumn('refresh_token');
        });
    }
}
