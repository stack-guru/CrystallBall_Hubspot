<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppSumoRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_sumo_requests', function (Blueprint $table) {
            $table->id();

            $table->mediumText('action')->nullable();
            $table->mediumText('plan_id')->nullable();
            $table->mediumText('uuid')->nullable();
            $table->mediumText('activation_email')->nullable();
            $table->mediumText('invoice_item_uuid')->nullable();

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
        Schema::dropIfExists('app_sumo_requests');
    }
}
