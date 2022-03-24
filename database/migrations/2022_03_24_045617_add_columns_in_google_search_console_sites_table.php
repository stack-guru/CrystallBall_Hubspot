<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsInGoogleSearchConsoleSitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_search_console_sites', function (Blueprint $table) {
            $table->boolean('was_last_data_fetching_successful')->default(true);
            $table->mediumText('last_data_fetching_error_message')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('google_search_console_sites', function (Blueprint $table) {
            $table->dropColumn(['was_last_data_fetching_successful', 'last_data_fetching_error_message']);
        });
    }
}
