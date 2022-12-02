<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTwitterTrackingColumnToUserAnnotationColorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->string('twitter_tracking')->default('#227c9d');
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
            $table->dropColumn('twitter_tracking');
        });
    }
}
