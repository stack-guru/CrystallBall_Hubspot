<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePricePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('price_plans', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100)->nullable()->default('Plan');
            $table->integer('annotations_count')->unsigned()->required()->default(0);
            $table->double('price')->unsigned()->required()->default(0.00);
            $table->boolean('has_manual_add')->required()->default(false);
            $table->boolean('has_csv_upload')->required()->default(false);
            $table->boolean('has_api')->required()->default(false);
            $table->boolean('is_enabled')->required()->default(true);

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
        Schema::dropIfExists('price_plans');
    }
}
