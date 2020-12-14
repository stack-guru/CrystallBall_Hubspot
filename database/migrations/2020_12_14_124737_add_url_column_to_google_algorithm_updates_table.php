<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUrlColumnToGoogleAlgorithmUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_algorithm_updates', function (Blueprint $table) {
            $table->string('url', 500)->required()->default('url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('google_algorithm_updates', function (Blueprint $table) {
            $table->dropColumn('url');
        });
    }
}
