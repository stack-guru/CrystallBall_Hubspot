<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAnalyticsPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_analytics_properties', function (Blueprint $table) {
            $table->id();
            $table->mediumText('permissions')->nullable();
            $table->string('property_id', 50)->nullable();
            $table->string('kind', 50)->nullable();
            $table->mediumText('self_link')->nullable();
            $table->bigInteger('account_id')->nullable()->unsigned();
            $table->bigInteger('internal_property_id')->nullable()->unsigned();
            $table->string('name', 100)->nullable();
            $table->mediumText('website_url')->nullable();
            $table->string('level', 100)->nullable();
            $table->bigInteger('profile_count')->nullable()->unsigned();
            $table->string('industry_vertical', 100)->nullable();
            $table->bigInteger('default_profile_id')->nullable()->unsigned();
            $table->string('data_retention_ttl', 100)->nullable();
            $table->timestamp('ga_created')->nullable();
            $table->timestamp('ga_updated')->nullable();
            $table->string('parent_type', 50)->nullable();
            $table->mediumText('parent_link')->nullable();
            $table->string('child_type', 50)->nullable();
            $table->mediumText('child_link')->nullable();
            
            $table->foreignId('google_analytics_account_id')->required()->constrained()->onDelete('CASCADE');
            $table->foreignId('google_account_id')->required()->constrained()->onDelete('CASCADE');
            $table->foreignId("user_id")->required()->constrained()->onDelete('CASCADE');

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
        Schema::dropIfExists('google_analytics_properties');
    }
}
