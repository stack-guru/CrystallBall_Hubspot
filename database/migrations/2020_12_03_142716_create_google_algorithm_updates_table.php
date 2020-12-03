<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAlgorithmUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_algorithm_updates', function (Blueprint $table) {
            $table->id();

            $table->string('category', 100)->required()->default('category');
            $table->string('event_name', 100)->required()->default('event_name');
            $table->mediumText('description')->nullable()->default(null);
            $table->date('update_date')->required();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('google_algorithm_updates');
    }
}
