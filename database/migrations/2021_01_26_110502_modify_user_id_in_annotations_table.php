<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ModifyUserIdInAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `annotations`
                DROP FOREIGN KEY `annotations_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `annotations`
                ADD CONSTRAINT `annotations_user_id_foreign`
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
            ALTER TABLE `annotations`
                DROP FOREIGN KEY `annotations_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `annotations`
                ADD CONSTRAINT `annotations_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
