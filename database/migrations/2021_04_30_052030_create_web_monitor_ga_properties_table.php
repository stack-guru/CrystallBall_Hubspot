<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebMonitorGaPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('web_monitor_ga_properties', function (Blueprint $table) {
            $table->id();

            $table->foreignId('web_monitor_id')->nullable()->constrained();

            $table->foreignId('google_analytics_property_id')->nullable()->constrained()->onDelete('CASCADE');
            $table->foreignId("user_id")->required()->constrained()->onDelete('CASCADE');

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
        Schema::dropIfExists('web_monitor_ga_properties');
    }
}
