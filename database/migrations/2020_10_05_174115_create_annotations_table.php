<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annotations', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('user_id')->required()->unsigned();
            $table->foreign('user_id')->references('id')->on('users');

            $table->string('category', 100)->required()->default('category');
            $table->string('event_type', 100)->required()->default('event_type');
            $table->string('event_name', 100)->required()->default('event_name');

            $table->mediumText('url')->nullable()->default(null);
            $table->mediumText('description')->nullable()->default(null);
            $table->string('title', 100)->required()->default('title');

            $table->date('show_at')->required();
            $table->string('type', 100)->required()->default('type');


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
        Schema::dropIfExists('annotations');
    }
}
