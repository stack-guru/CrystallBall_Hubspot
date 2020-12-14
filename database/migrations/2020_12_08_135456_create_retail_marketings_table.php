<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRetailMarketingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('retail_marketings', function (Blueprint $table) {
            $table->id();
            $table->string('category', 100)->required()->default('category');
            $table->string('event_name', 100)->required()->default('event_name');
            $table->mediumText('description')->nullable()->default(null);
            $table->string('url', 500)->required()->default('url');
            $table->date('show_at')->required();
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
        Schema::dropIfExists('retail_marketings');
    }
}
