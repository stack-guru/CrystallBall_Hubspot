<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveTechFieldsToWebsiteTechnologyLookups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('website_technology_lookups', function (Blueprint $table) {
            $table->dropColumn('tech1');
            $table->dropColumn('tech2');
            $table->dropColumn('tech3');
            $table->dropColumn('tech4');
            $table->dropColumn('tech5');
            $table->dropColumn('tech6');
            $table->dropColumn('tech7');
            $table->dropColumn('tech8');
            $table->dropColumn('tech9');
            $table->dropColumn('tech10');
            $table->dropColumn('tech11');
            $table->dropColumn('tech12');
            $table->dropColumn('tech13');
            $table->dropColumn('tech14');
            $table->dropColumn('tech15');
            $table->dropColumn('tech16');
            $table->dropColumn('tech17');
            $table->dropColumn('tech18');
            $table->dropColumn('tech19');
            $table->dropColumn('tech20');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('website_technology_lookups', function (Blueprint $table) {
            //
        });
    }
}
