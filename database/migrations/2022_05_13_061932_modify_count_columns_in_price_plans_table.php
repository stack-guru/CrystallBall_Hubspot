<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ModifyCountColumnsInPricePlansTable extends Migration
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
                CHANGE `ga_account_count` `ga_account_count` INT(10) NOT NULL DEFAULT '0',
                CHANGE `user_per_ga_account_count` `user_per_ga_account_count` INT(10) NOT NULL DEFAULT '0',
                CHANGE `web_monitor_count` `web_monitor_count` INT(10) NOT NULL DEFAULT '0'
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
                CHANGE `ga_account_count` `ga_account_count` INT(10) UNSIGNED NULL DEFAULT '0',
                CHANGE `user_per_ga_account_count` `user_per_ga_account_count` INT(10) UNSIGNED NULL DEFAULT '0',
                CHANGE `web_monitor_count` `web_monitor_count` INT(10) UNSIGNED NOT NULL DEFAULT '0'
            ;
            "
        );
    }
}
