<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsCompetitorUrlColumnToUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->boolean('is_competitor_url')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->dropColumn('is_competitor_url');
        });
    }
}
