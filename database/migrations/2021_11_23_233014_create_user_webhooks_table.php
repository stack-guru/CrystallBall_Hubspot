<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserWebhooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_webhooks', function (Blueprint $table) {
            $table->id();

            $table->string('request_method', 20)->required();
            $table->mediumText('endpoint_uri')->required();

            $table->integer('executions_count')->unsigned()->nullable()->default(null);
            $table->timestamp('last_executed_at')->nullable()->default(null);

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
        Schema::dropIfExists('user_webhooks');
    }
}
