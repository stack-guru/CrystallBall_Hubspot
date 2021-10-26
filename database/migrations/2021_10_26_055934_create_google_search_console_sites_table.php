<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleSearchConsoleSitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_search_console_sites', function (Blueprint $table) {
            $table->id();

            $table->mediumText('site_url')->nullable()->default(null);
            $table->string('permission_level', 100)->nullable()->default(null);

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
        Schema::dropIfExists('google_search_console_sites');
    }
}
