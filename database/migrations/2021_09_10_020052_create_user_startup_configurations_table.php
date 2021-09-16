<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserStartupConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_startup_configurations', function (Blueprint $table) {
            $table->id();

            $table->integer('step_number')->unsigned()->required();
            $table->string('data_label', 50)->required();
            $table->string('data_value', 500)->nullable();

            $table->bigInteger('user_id')->required()->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

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
        Schema::dropIfExists('user_startup_configurations');
    }
}
