<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGoogleSearchConsoleSiteIdToGoogleAnalyticsPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_analytics_properties', function (Blueprint $table) {
            $table->bigInteger('google_search_console_site_id')->nullable()->unsigned();
            $table->foreign('google_search_console_site_id', 'ga_properties_g_search_console_site_id_foreign')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('google_analytics_properties', function (Blueprint $table) {
            $table->dropForeign('ga_properties_g_search_console_site_id_foreign');
            $table->dropColumn('google_search_console_site_id');
        });
    }
}
