<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGAdsHistoryChangeAnomoliesDetectionBudgetTrackingToUserAnnotationColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->string('g_ads_history_change', 10)->nullable()->default('#227c9d');
            $table->string('anomolies_detection', 10)->nullable()->default('#227c9d');
            $table->string('budget_tracking', 10)->nullable()->default('#227c9d');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_annotation_colors', function (Blueprint $table) {
            $table->dropColumn('g_ads_history_change');
            $table->dropColumn('anomolies_detection');
            $table->dropColumn('budget_tracking');
        });
    }
}
