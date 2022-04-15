<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRegistrationOffersColumnsInPricePlanSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plan_subscriptions', function (Blueprint $table) {

            $table->unsignedBigInteger('user_registration_offer_id')->nullable();
            $table->foreign('user_registration_offer_id')->references('id')->on('user_registration_offers')->onDelete('RESTRICT');

            $table->integer('left_registration_offer_recurring')->unsigned()->nullable()->default(0);
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
            $table->dropConstrainedForeignId('user_registration_offer_id');
            $table->dropColumn(['left_registration_offer_recurring']);
        });
    }
}
