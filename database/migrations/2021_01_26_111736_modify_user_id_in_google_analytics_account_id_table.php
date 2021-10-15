<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ModifyUserIdInGoogleAnalyticsAccountIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `user_ga_accounts`
                DROP FOREIGN KEY `user_ga_accounts_google_analytics_account_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `user_ga_accounts`
                ADD CONSTRAINT `user_ga_accounts_google_analytics_account_id_foreign`
                FOREIGN KEY (`google_analytics_account_id`) REFERENCES `google_analytics_accounts` (`id`)
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
            ALTER TABLE `user_ga_accounts`
                DROP FOREIGN KEY `user_ga_accounts_google_analytics_account_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `user_ga_accounts`
                ADD CONSTRAINT `user_ga_accounts_google_analytics_account_id_foreign`
                FOREIGN KEY (`google_analytics_account_id`) REFERENCES `google_analytics_accounts` (`id`)
                ;
            ");
    }
}
