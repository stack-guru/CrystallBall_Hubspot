<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyPaymentDetailIdInPricePlanSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `price_plan_subscriptions`
                DROP FOREIGN KEY `price_plan_subscriptions_payment_detail_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `price_plan_subscriptions`
                ADD CONSTRAINT `price_plan_subscriptions_payment_detail_id_foreign`
                FOREIGN KEY (`payment_detail_id`) REFERENCES `payment_details` (`id`)
                ON DELETE CASCADE
                ;
            ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("
            ALTER TABLE `price_plan_subscriptions`
                DROP FOREIGN KEY `price_plan_subscriptions_payment_detail_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `price_plan_subscriptions`
                ADD CONSTRAINT `price_plan_subscriptions_payment_detail_id_foreign`
                FOREIGN KEY (`payment_detail_id`) REFERENCES `payment_details` (`id`)
                ;
            ");
    }
}
