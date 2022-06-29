<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKeywordConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('keyword_configurations', function (Blueprint $table) {
            $table->id();
            $table->text('url')->nullable();
            $table->string('search_engine')->nullable();
            $table->string('location_code')->nullable();
            $table->string('language')->nullable();
            $table->string('ranking_direction')->nullable();
            $table->unsignedInteger('ranking_places_changed')->nullable();
            $table->boolean('is_url_competitors')->nullable();
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
        Schema::dropIfExists('keyword_configurations');
    }
}
