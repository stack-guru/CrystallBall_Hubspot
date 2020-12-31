<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
                DROP CONSTRAINT `annotation_ga_accounts_annotation_id_foreign`
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
                DROP CONSTRAINT `annotation_ga_accounts_annotation_id_foreign`
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
