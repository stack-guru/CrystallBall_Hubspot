<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeOfUsersDevicesCountInPricePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->string('users_devices_count')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->integer('users_devices_count')->unsigned()->required()->default(2)->change();
        });
    }
}
