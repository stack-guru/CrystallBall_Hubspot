<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMonitorIdToShopifyAnnotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shopify_annotations', function (Blueprint $table) {
            // Add monitor_id column
            $table->unsignedBigInteger('monitor_id')->nullable();

            // Add foreign key constraint
            $table->foreign('monitor_id')
                ->references('id')
                ->on('shopify_monitors')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shopify_annotations', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['monitor_id']);

            // Drop monitor_id column
            $table->dropColumn('monitor_id');
        });
    }
}
