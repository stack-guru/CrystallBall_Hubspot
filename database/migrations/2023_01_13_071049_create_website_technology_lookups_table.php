<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebsiteTechnologyLookupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('website_technology_lookups', function (Blueprint $table) {
            $table->id();
            $table->string('site_url')->nullable()->default(null);
            $table->string('tech1')->nullable()->default(null);
            $table->string('tech2')->nullable()->default(null);
            $table->string('tech3')->nullable()->default(null);
            $table->string('tech4')->nullable()->default(null);
            $table->string('tech5')->nullable()->default(null);
            $table->string('tech6')->nullable()->default(null);
            $table->string('tech7')->nullable()->default(null);
            $table->string('tech8')->nullable()->default(null);
            $table->string('tech9')->nullable()->default(null);
            $table->string('tech10')->nullable()->default(null);
            $table->string('tech11')->nullable()->default(null);
            $table->string('tech12')->nullable()->default(null);
            $table->string('tech13')->nullable()->default(null);
            $table->string('tech14')->nullable()->default(null);
            $table->string('tech15')->nullable()->default(null);
            $table->string('tech16')->nullable()->default(null);
            $table->string('tech17')->nullable()->default(null);
            $table->string('tech18')->nullable()->default(null);
            $table->string('tech19')->nullable()->default(null);
            $table->string('tech20')->nullable()->default(null);
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
        Schema::dropIfExists('website_technology_lookups');
    }
}
