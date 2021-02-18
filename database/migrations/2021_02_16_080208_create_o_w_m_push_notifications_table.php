<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOWMPushNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('o_w_m_push_notifications', function (Blueprint $table) {
            $table->id();

            $table->string('owm_alert_id', 200)->nullable();
            $table->string('shape', 20)->nullable();
            $table->mediumText('location_coordinates')->nullable()->default(null);
            $table->string('alert_type', 20)->nullable();
            $table->string('categories', 100)->nullable();
            $table->string('urgency', 20)->nullable();
            $table->string('severity', 20)->nullable();
            $table->string('certainty', 20)->nullable();
            $table->date('alert_date')->nullable();
            $table->string('sender_name', 100)->nullable()->default(null);
            $table->string('event', 100)->nullable()->default(null);
            $table->string('headline', 200)->nullable()->default(null);
            $table->mediumText('description')->nullable()->default(null);

            $table->foreignId('open_weather_map_city_id')->onDelete('CASCASE')->nullable()->default(null)->constrained();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('o_w_m_push_notifications');
    }
}
