<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddShopifyInUserDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->bigInteger('shopify_annotation_id')->nullable()->unsigned();
        });

        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->foreign('shopify_annotation_id')->references('id')->on('shopify_annotations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_data_sources', function (Blueprint $table) {
            $table->dropForeign('shopify_annotation_id', ['shopify_annotation_id']);
        });
    }
}
