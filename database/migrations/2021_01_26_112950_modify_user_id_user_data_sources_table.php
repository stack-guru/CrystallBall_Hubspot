<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class ModifyUserIdUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `user_data_sources`
                DROP FOREIGN KEY `user_data_sources_user_id_foreign`
                ;
           ");
        DB::statement("
            ALTER TABLE `user_data_sources`
                ADD CONSTRAINT `user_data_sources_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
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
            ALTER TABLE `user_data_sources`
                DROP FOREIGN KEY `user_data_sources_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `user_data_sources`
                ADD CONSTRAINT `user_data_sources_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
