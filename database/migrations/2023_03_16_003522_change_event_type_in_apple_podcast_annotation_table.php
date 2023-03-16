<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeEventTypeInApplePodcastAnnotationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('apple_podcast_annotations', function (Blueprint $table) {
            $table->longText("event")->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('apple_podcast_annotations', function (Blueprint $table) {
            $table->string("event")->nullable()->change();
        });
    }
}
