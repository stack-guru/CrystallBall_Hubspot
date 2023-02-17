<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ChangeShopifyTypeInPricePlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement(
            "
            ALTER TABLE `price_plans`
                CHANGE `shopify_monitor_count` `shopify_monitor_count` INT(10) NOT NULL DEFAULT '0',
            ;
            "
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement(
            "
            ALTER TABLE `price_plans`
                CHANGE `shopify_monitor_count` `shopify_monitor_count` INT(10) UNSIGNED NULL DEFAULT '0',
            ;
            "
        );
    }
}
