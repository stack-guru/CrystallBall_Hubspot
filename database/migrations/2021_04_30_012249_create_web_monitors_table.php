<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebMonitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('web_monitors', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100)->nullable()->default(null);
            $table->mediumText('url')->required();
            $table->bigInteger('uptime_robot_id')->unsigned()->nullable()->default(null);
            $table->string('email_address', 100)->nullable()->default(null);
            $table->string('sms_phone_number', 100)->nullable()->default(null);
            $table->string('last_status', 50)->nullable()->default(null);
            $table->dateTime('last_synced_at')->nullable();

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
        Schema::dropIfExists('web_monitors');
    }
}
