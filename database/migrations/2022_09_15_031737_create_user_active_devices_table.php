<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserActiveDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_active_devices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            
            $table->string('browser_name')->nullable();
            $table->string('platform_name')->nullable();
            $table->string('device_type')->nullable();

            $table->text('session_id')->nullable();
            $table->unsignedBigInteger('access_token_id')->nullable();

            $table->boolean('is_extension')->nullable();
            $table->string('ip')->nullable();
            $table->string('last_activity')->nullable();
            
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
        Schema::dropIfExists('user_active_devices');
    }
}
