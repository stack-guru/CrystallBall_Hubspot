<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAnnotationColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_annotation_colors', function (Blueprint $table) {
            $table->id();

            $table->string('manual', 10)->nullable()->default('#d00000');
            $table->string('csv', 10)->nullable()->default('#d00000');
            $table->string('api', 10)->nullable()->default('#d00000');
            $table->string('holidays', 10)->nullable()->default('#d00000');
            $table->string('google_algorithm_updates', 10)->nullable()->default('#d00000');
            $table->string('retail_marketings', 10)->nullable()->default('#d00000');
            $table->string('weather_alerts', 10)->nullable()->default('#d00000');
            $table->string('web_monitors', 10)->nullable()->default('#d00000');
            $table->string('wordpress_updates', 10)->nullable()->default('#d00000');
            $table->string('google_alerts', 10)->nullable()->default('#d00000');

            $table->foreignId("user_id")->unique()->required()->constrained()->onDelete('CASCADE');

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
        Schema::dropIfExists('user_annotation_colors');
    }
}
