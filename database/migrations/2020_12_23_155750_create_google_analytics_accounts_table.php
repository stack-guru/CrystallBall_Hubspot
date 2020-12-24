<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAnalyticsAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_analytics_accounts', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('ga_id')->unsigned();
            $table->string('name')->required();
            $table->mediumText('self_link')->nullable()->default(null);
            $table->mediumText('permissions')->nullable()->default(null);
            $table->timestamp('ga_created')->nullable();
            $table->timestamp('ga_updated')->nullable();

            $table->string('property_type')->nullable()->default(null);
            $table->mediumText('property_href')->nullable()->default(null);

            $table->foreignId('google_account_id')->required()->constrained();
            $table->foreignId("user_id")->required()->constrained();

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
        Schema::dropIfExists('google_analytics_accounts');
    }
}
