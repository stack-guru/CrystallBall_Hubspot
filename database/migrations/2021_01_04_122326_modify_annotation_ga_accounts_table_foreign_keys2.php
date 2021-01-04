<?php

use Illuminate\Database\Migrations\Migration;

class ModifyAnnotationGaAccountsTableForeignKeys2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `annotation_ga_accounts`
                DROP FOREIGN KEY `annotation_ga_accounts_google_analytics_account_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `annotation_ga_accounts`
                ADD CONSTRAINT `annotation_ga_accounts_google_analytics_account_id_foreign`
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
            ALTER TABLE `annotation_ga_accounts`
                DROP FOREIGN KEY `annotation_ga_accounts_google_analytics_account_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `annotation_ga_accounts`
                ADD CONSTRAINT `annotation_ga_accounts_google_analytics_account_id_foreign`
                FOREIGN KEY (`google_analytics_account_id`) REFERENCES `google_analytics_accounts` (`id`)
                ;
            ");
    }
}
