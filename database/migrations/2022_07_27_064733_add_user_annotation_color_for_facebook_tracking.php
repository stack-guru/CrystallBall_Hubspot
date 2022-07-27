<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserAnnotationColorForFacebookTracking extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->string('facebook_tracking', 10)->nullable()->default('#227c9d');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->dropColumn('facebook_tracking');
        });
    }
}
