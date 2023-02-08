<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColorHexCodeColumnInGoogleAnalyticsPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_analytics_properties', function (Blueprint $table) {
            $table->string('color_hex_code', 20)->nullable()->default('null');
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
            $table->dropColumn('color_hex_code');
        });
    }
}
