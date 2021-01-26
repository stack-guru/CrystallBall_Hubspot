<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyUserIdInGoogleAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `google_accounts`
                DROP FOREIGN KEY `google_accounts_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `google_accounts`
                ADD CONSTRAINT `google_accounts_user_id_foreign`
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
            ALTER TABLE `google_accounts`
                DROP FOREIGN KEY `google_accounts_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `google_accounts`
                ADD CONSTRAINT `google_accounts_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
