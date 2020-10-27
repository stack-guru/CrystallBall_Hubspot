<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentRelatedColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('price_plan_id')->nullable()->unsigned();
            $table->foreign('price_plan_id')->references('id')->on('price_plans')->onDelete('SET NULL');

            $table->date('price_plan_expiry_date')->nullable()->default(null);

            $table->bigInteger('annotations_count')->unsigned()->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('annotations_count');
            $table->dropColumn('price_plan_expiry_date');

            $table->dropForeign('users_price_plan_id_foreign');
            $table->dropColumn('price_plan_id');
        });
    }
}
