<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserChecklistItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_checklist_items', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('checklist_item_id')->required()->unsigned();
            $table->foreign('checklist_item_id')->references('id')->on('checklist_items')->onDelete('cascade');

            $table->timestamp('last_viewed_at')->nullable()->default(null);
            $table->timestamp('completed_at')->nullable()->default(null);

            $table->bigInteger('user_id')->required()->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

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
        Schema::dropIfExists('user_checklist_items');
    }
}
