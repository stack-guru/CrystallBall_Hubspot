<?php

use Illuminate\Database\Migrations\Migration;

class ModifyUserIdUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `users`
                DROP FOREIGN KEY `users_user_id_foreign`
                ;
           ");
        DB::statement("
            ALTER TABLE `users`
                ADD CONSTRAINT `users_user_id_foreign`
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
            ALTER TABLE `users`
                DROP FOREIGN KEY `users_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `users`
                ADD CONSTRAINT `users_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
