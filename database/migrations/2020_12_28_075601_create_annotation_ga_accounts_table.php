<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnotationGAAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annotation_ga_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annotation_id')->nullable()->constrained();

            $table->foreignId('google_analytics_account_id')->nullable()->onDelete('CASCADE')->constrained();
            $table->foreignId("user_id")->required()->onDelete('CASCADE')->constrained();

            $table->timestamps();
        });
        Schema::table('annotations', function (Blueprint $table) {
            $table->dropForeign('annotations_google_account_id_foreign');
            $table->dropColumn('google_account_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('annotations', function (Blueprint $table) {
            $table->foreignId('google_account_id')->nullable()->constrained();
        });
        Schema::dropIfExists('annotation_ga_accounts');
    }
}
