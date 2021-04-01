<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWordpressUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wordpress_updates', function (Blueprint $table) {
            $table->id();

            $table->string('category', 100)->required()->default('category');
            $table->string('event_name', 100)->required()->default('event_name');
            $table->mediumText('description')->nullable()->default(null);
            $table->date('update_date')->required();
            $table->string('url', 500)->required()->default('url');
            $table->string('status', 15)->nullable()->default(false);

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
        Schema::dropIfExists('wordpress_updates');
    }
}
