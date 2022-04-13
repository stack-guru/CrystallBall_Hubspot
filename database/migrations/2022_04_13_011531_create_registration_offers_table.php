<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistrationOffersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registration_offers', function (Blueprint $table) {
            $table->id();

            $table->string('name')->required();
            $table->string('code')->required();
            $table->string('heading')->required();
            $table->mediumText('description')->nullable();

            $table->mediumText('on_click_url')->nullable();
            $table->double('discount_percent', 5, 2)->required();

            $table->integer('monthly_recurring_discount_count')->required();
            $table->integer('yearly_recurring_discount_count')->required();

            $table->string('expires_in_period')->required();
            $table->integer('expires_in_value')->required();

            $table->boolean('is_enabled')->default(false);
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
        Schema::dropIfExists('registration_offers');
    }
}
