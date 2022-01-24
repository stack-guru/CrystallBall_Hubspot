<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAppSumoInvoiceItemUuidColumnInPricePlanSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->string('app_sumo_invoice_item_uuid', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->dropColumn('app_sumo_invoice_item_uuid');
        });
    }
}
