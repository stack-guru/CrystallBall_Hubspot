<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTransactionIdToPricePlanSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->string('transaction_id', 100)->default('default-value')->required();

            $table->bigInteger('price_plan_id')->nullable()->unsigned();
            $table->foreign('price_plan_id')->references('id')->on('price_plans')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->dropColumn('transaction_id');

            $table->dropForeign('price_plan_subscriptions_price_plan_id_foreign');
            $table->dropColumn('price_plan_id');
        });
    }
}
