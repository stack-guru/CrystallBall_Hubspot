<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();

            $table->boolean('is_enabled')->nullable()->default(false);

            $table->string('name', 100);
            $table->string('label', 100);

            $table->boolean('email_seven_days_before')->nullable()->default(false);
            $table->boolean('email_one_days_before')->nullable()->default(false);
            $table->boolean('email_on_event_day')->nullable()->default(false);

            $table->boolean('browser_notification_on_event_day')->nullable()->default(false);

            $table->boolean('sms_on_event_day')->nullable()->default(false);

            $table->bigInteger('user_id')->required()->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notification_settings');
    }
}
