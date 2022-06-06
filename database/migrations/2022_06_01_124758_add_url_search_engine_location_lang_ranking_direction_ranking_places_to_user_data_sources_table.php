<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUrlSearchEngineLocationLangRankingDirectionRankingPlacesToUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->text('url')->nullable();
            $table->text('search_engine')->nullable();
            $table->text('location')->nullable();
            $table->text('lang')->nullable();
            $table->text('ranking_direction')->nullable();
            $table->text('ranking_places')->nullable();
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
            $table->dropColumn('url');
            $table->dropColumn('search_engine');
            $table->dropColumn('location');
            $table->dropColumn('lang');
            $table->dropColumn('ranking_direction');
            $table->dropColumn('ranking_places');
        });
    }
}
