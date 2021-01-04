<?php

use Illuminate\Database\Migrations\Migration;

class ModifyGoogleAnalyticsAccountsTableForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `google_analytics_accounts`
                DROP FOREIGN KEY `google_analytics_accounts_google_account_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `google_analytics_accounts`
                ADD CONSTRAINT `google_analytics_accounts_google_account_id_foreign`
                FOREIGN KEY (`google_account_id`) REFERENCES `google_accounts` (`id`)
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
            ALTER TABLE `google_analytics_accounts`
                DROP FOREIGN KEY `google_analytics_accounts_google_account_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `google_analytics_accounts`
                ADD CONSTRAINT `google_analytics_accounts_google_account_id_foreign`
                FOREIGN KEY (`google_account_id`) REFERENCES `google_accounts` (`id`)
                ;
            ");
    }
}
