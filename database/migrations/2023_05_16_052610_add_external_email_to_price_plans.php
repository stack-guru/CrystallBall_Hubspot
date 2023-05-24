<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExternalEmailToPricePlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->integer('external_email')->default(-1);
            $table->integer('facebook_credits_count')->default(-1)->change();
            $table->integer('instagram_credits_count')->default(-1)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('price_plans', function (Blueprint $table) {
            $table->dropColumn('external_email');
            $table->dropColumn('facebook_credits_count');
            $table->dropColumn('instagram_credits_count');
        });
    }
}
