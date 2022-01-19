<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ModifyUserIdInWebMonitorAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `web_monitor_annotations`
                DROP FOREIGN KEY `web_monitor_annotations_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `web_monitor_annotations`
                ADD CONSTRAINT `web_monitor_annotations_user_id_foreign`
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
            ALTER TABLE `web_monitor_annotations`
                DROP FOREIGN KEY `web_monitor_annotations_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `web_monitor_annotations`
                ADD CONSTRAINT `web_monitor_annotations_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
