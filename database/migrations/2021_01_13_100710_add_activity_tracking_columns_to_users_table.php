<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddActivityTrackingColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp("last_logged_into_extension_at")->nullable();
            $table->timestamp("last_activated_any_data_source_at")->nullable();
            $table->timestamp("last_generated_api_token_at")->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn("last_logged_into_extension_at", "last_activated_any_data_source_at", "last_generated_api_token_at");
        });
    }
}
