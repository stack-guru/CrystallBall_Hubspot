<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdwordsClientCustomerIdColumnToGoogleAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('google_accounts', function (Blueprint $table) {
            $table->string('adwords_client_customer_id', 50)->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('google_accounts', function (Blueprint $table) {
            $table->dropColumn('adwords_client_customer_id');
        });
    }
}
