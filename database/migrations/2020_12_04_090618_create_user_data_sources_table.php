<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_data_sources', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->nullable()->constrained();

            $table->string('ds_code', 50)->required();
            $table->string('ds_name', 50)->required();
            
            $table->string('country_name', 30)->nullable();

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
        Schema::dropIfExists('user_data_sources');
    }
}
