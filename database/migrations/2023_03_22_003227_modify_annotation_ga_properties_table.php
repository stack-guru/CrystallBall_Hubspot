<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyAnnotationGaPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('annotation_ga_properties', function (Blueprint $table) {
            $table->dropForeign('annotation_ga_properties_annotation_id_foreign');
            $table->string('annotation_table')->default('')->after('annotation_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("
        ALTER TABLE `annotation_ga_properties`
            ADD CONSTRAINT `annotation_ga_properties_annotation_id_foreign`
            FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`id`)
            ON DELETE CASCADE
            ;
        ");

        Schema::table('annotation_ga_properties', function (Blueprint $table) {
            $table->dropColumn('annotation_table');
        });
    }
}
