<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentDetailIdToPricePlanSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->foreignId("payment_detail_id")->default('default-value')->constrained()->required();
            
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
            $table->dropForeign(['payment_detail_id']);
            $table->dropColumn('payment_detail_id');
        });
    }
}
