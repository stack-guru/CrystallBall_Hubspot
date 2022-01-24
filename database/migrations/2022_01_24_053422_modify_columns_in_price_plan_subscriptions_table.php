<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ModifyColumnsInPricePlanSubscriptionsTable extends Migration
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
            MODIFY `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci NULL,
            MODIFY `payment_detail_id` bigint unsigned NULL
        ;
        ");
        DB::statement("
            ALTER TABLE `price_plan_subscriptions`
                ADD CONSTRAINT `price_plan_subscriptions_payment_detail_id_foreign`
                FOREIGN KEY (`payment_detail_id`) REFERENCES `payment_details` (`id`)
                ON DELETE SET NULL
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
        // It's not possible to make a nullable column (with null values) a NOT NULL column
        // DB::statement("
        // ALTER TABLE `price_plan_subscriptions`
        //     MODIFY `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
        //     MODIFY `payment_detail_id` bigint unsigned NOT NULL
        // ;
        // ");
        DB::statement("
            ALTER TABLE `price_plan_subscriptions`
                ADD CONSTRAINT `price_plan_subscriptions_payment_detail_id_foreign`
                FOREIGN KEY (`payment_detail_id`) REFERENCES `payment_details` (`id`)
                ON DELETE CASCADE
                ;
            ");
    }
}
