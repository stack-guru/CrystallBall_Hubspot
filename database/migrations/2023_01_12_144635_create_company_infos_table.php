<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('company_infos', function (Blueprint $table) {
            $table->id();
            $table->string('user_name')->nullable()->default(null);
            $table->string('company_name')->nullable()->default(null);

            $table->string('company_size')->nullable()->default(null);
            $table->string('industry')->nullable()->default(null);
            $table->string('language')->nullable()->default(null);

            $table->string('ip')->nullable()->default(null);
            $table->string('location')->nullable()->default(null);
            $table->string('facebook')->nullable()->default(null);

            $table->string('twitter')->nullable()->default(null);
            $table->string('linkedin')->nullable()->default(null);
            $table->string('instagram')->nullable()->default(null);
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
        Schema::dropIfExists('company_infos');
    }
}
