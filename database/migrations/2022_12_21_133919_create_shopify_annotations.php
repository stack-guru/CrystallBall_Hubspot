<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopifyAnnotations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shopify_annotations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->required()->unsigned();
            $table->bigInteger('product_id')->required()->unsigned();
            $table->string("category")->nullable();
            $table->string("title")->nullable();
            $table->string("handle")->nullable();
            $table->longText("body_html")->nullable();
            $table->string("vendor")->nullable();
            $table->string("product_type")->nullable();
            $table->date("published_at")->nullable();
            $table->date("shopify_updated_at")->nullable();
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
        Schema::dropIfExists('shopify_annotations');
    }
}
