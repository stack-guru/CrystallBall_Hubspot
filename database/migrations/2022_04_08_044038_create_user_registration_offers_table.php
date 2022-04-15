<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserRegistrationOffersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_registration_offers', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100)->required();
            $table->string('code', 100)->required();

            $table->string('heading', 255)->required();
            $table->string('description', 255)->nullable();
            $table->mediumText('on_click_url')->nullable();

            $table->bigInteger("usage_count")->unsigned()->default(0);
            $table->double('discount_percent', 5, 2)->required()->default(0.00);
            $table->timestamp('expires_at')->required();
            $table->integer('recurring_discount_count')->unsigned()->nullable()->default(0);

            $table->bigInteger('registration_offer_id')->required()->unsigned();
            $table->foreign('registration_offer_id')->references('id')->on('registration_offers')->onDelete('RESTRICT');

            $table->bigInteger('user_id')->required()->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE');

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
        Schema::dropIfExists('user_registration_offers');
    }
}
