<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsConfirmedColumnToGoogleAlgorithmUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_algorithm_updates', function (Blueprint $table) {
            $table->boolean('is_confirmed')->nullable()->default(false);
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
            $table->dropColumn('is_confirmed');
        });
    }
}
