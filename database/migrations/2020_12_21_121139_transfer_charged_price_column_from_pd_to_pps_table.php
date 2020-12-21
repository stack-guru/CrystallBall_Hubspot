<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TransferChargedPriceColumnFromPdToPpsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->double('charged_price', 15, 3)->nullable()->default(0.00);
        });

        DB::statement("UPDATE price_plan_subscriptions INNER JOIN payment_details ON price_plan_subscriptions.payment_detail_id = payment_details.id SET price_plan_subscriptions.charged_price = payment_details.charged_price;");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {
            $table->dropColumn('charged_price');
        });

    }
}
