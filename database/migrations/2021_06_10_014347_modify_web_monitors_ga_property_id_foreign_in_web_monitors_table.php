<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyWebMonitorsGaPropertyIdForeignInWebMonitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE `web_monitors`
                DROP FOREIGN KEY `web_monitors_ga_property_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `web_monitors`
                ADD CONSTRAINT `web_monitors_ga_property_id_foreign`
                FOREIGN KEY (`ga_property_id`) REFERENCES `google_analytics_properties` (`id`)
                ON DELETE CASCADE
                ;
            ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("
            ALTER TABLE `web_monitors`
                DROP FOREIGN KEY `web_monitors_ga_property_id_foreign`
                ;
            ");
        DB::statement("
            ALTER TABLE `web_monitors`
                ADD CONSTRAINT `web_monitors_ga_property_id_foreign`
                FOREIGN KEY (`ga_property_id`) REFERENCES `google_analytics_properties` (`id`)
                ;
            ");
    }
}
