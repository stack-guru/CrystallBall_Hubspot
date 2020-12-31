<?php

use Illuminate\Database\Migrations\Migration;

class ModifyAnnotationGaAccountsTableForeignKeys extends Migration
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
                DROP FOREIGN KEY `annotation_ga_accounts_annotation_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `annotation_ga_accounts`
                ADD CONSTRAINT `annotation_ga_accounts_annotation_id_foreign`
                FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`id`)
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
                DROP FOREIGN KEY `annotation_ga_accounts_annotation_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `annotation_ga_accounts`
                ADD CONSTRAINT `annotation_ga_accounts_annotation_id_foreign`
                FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`id`)
                ;
            ");
    }
}
