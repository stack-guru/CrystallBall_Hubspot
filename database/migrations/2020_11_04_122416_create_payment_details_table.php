<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_details', function (Blueprint $table) {
            $table->id();

            $table->string('cardholder_name');
            $table->string('card_number');
            $table->tinyInteger('expiry_month')->required();
            $table->bigInteger('expiry_year')->required();
            $table->string('bluesnap_card_id')->nullable();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('billing_address');
            $table->string('city');
            $table->bigInteger('zip_code')->required();
            $table->string('country');
            $table->string('bluesnap_vaulted_shopper_id')->nullable();

            $table->foreignId("user_id")->required();

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
        Schema::dropIfExists('payment_details');
    }
}
