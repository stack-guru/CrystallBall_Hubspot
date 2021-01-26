<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyUserIdInPaymentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `payment_details`
                DROP FOREIGN KEY `payment_details_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `payment_details`
                ADD CONSTRAINT `payment_details_user_id_foreign`
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
            ALTER TABLE `payment_details`
                DROP FOREIGN KEY `payment_details_user_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `payment_details`
                ADD CONSTRAINT `payment_details_user_id_foreign`
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
                ;
            ");
    }
}
