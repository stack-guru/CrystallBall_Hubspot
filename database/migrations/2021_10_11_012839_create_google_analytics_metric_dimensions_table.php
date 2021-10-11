<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleAnalyticsMetricDimensionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_analytics_metric_dimensions', function (Blueprint $table) {
            $table->id();

            $table->date('statistics_date')->required();
            $table->string('source_name')->nullable()->default(null);
            $table->string('medium_name')->nullable()->default(null);
            $table->string('device_category')->nullable()->default(null);

            $table->integer('users_count')->unsigned()->nullable()->default(null);
            $table->integer('sessions_count')->unsigned()->nullable()->default(null);

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
        Schema::dropIfExists('google_analytics_metric_dimensions');
    }
}
