<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ModifyUserIdInAutoPaymentLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `auto_payment_logs`
                DROP FOREIGN KEY `auto_payment_logs_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `auto_payment_logs`
                ADD CONSTRAINT `auto_payment_logs_user_id_foreign`
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
            ALTER TABLE `auto_payment_logs`
                DROP FOREIGN KEY `auto_payment_logs_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `auto_payment_logs`
                ADD CONSTRAINT `auto_payment_logs_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
