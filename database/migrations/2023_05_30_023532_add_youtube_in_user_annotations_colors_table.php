<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddYoutubeInUserAnnotationsColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->string('youtube_tracking', 10)->nullable()->default('#fe4c3c');
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
            $table->dropColumn('youtube_tracking');
        });
    }
}
