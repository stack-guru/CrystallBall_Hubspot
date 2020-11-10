<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAutoPaymentLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('auto_payment_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId("user_id")->constrained()->required();
            $table->foreignId("payment_detail_id")->constrained()->required();
            $table->foreignId("price_plan_subscription_id")->constrained()->nullable();
            $table->foreignId("price_plan_id")->constrained()->nullable();
            
            $table->string('card_number')->nullable();
            $table->mediumText('transaction_message')->nullable()->default(null);
            
            $table->double('charged_price', 15, 3)->nullable()->default(0.00);
            $table->boolean('was_successful')->nullable()->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('auto_payment_logs');
    }
}
