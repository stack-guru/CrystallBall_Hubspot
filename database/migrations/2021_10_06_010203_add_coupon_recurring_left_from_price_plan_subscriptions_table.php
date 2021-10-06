<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCouponRecurringLeftFromPricePlanSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->integer('left_coupon_recurring')->unsigned()->nullable()->default(0);
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
            $table->dropColumn('left_coupon_recurring');
        });
    }
}
