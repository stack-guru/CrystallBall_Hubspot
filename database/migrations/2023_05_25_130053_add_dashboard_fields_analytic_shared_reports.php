<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDashboardFieldsAnalyticSharedReports extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('analytic_shared_reports', function (Blueprint $table) {
            $table->integer('dashboard_id')->nullable();
            $table->string('recurrence')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('analytic_shared_reports', function (Blueprint $table) {
            $table->dropColumn('dashboard_id');
            $table->dropColumn('recurrence');
        });
    }
}
