<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKeywordMetasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('keyword_metas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('keyword_id');
            $table->unsignedBigInteger('keyword_configuration_id');
            $table->text('dfs_task_id')->nullable();
            $table->text('current_ranking')->nullable();
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
        Schema::dropIfExists('keyword_metas');
    }
}
