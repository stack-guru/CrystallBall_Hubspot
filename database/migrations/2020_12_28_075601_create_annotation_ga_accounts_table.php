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

            $table->foreignId('google_analytics_account_id')->nullable()->constrained();
            $table->foreignId('google_account_id')->required()->constrained();
            $table->foreignId("user_id")->required()->constrained();

            $table->timestamps();
        });
        DB::statement("INSERT INTO annotation_ga_accounts (annotation_id, google_analytics_account_id, google_account_id, user_id) SELECT annotations.id, null, google_account_id, annotations.user_id FROM annotations INNER JOIN google_accounts ON google_accounts.id = annotations.google_account_id WHERE google_account_id IS NOT NULL;");
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
        DB::statement("UPDATE annotations LEFT JOIN annotation_ga_accounts ON annotations.id = annotation_ga_accounts.annotation_id SET annotations.google_account_id = annotation_ga_accounts.google_account_id;");
        Schema::dropIfExists('annotation_ga_accounts');
    }
}
