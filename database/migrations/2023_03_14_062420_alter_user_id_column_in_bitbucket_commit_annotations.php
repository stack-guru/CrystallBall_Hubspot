<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserIdColumnInBitbucketCommitAnnotations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bitbucket_commit_annotations', function (Blueprint $table) {            
            $table->bigInteger('user_id')->required()->unsigned()->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bitbucket_commit_annotations', function (Blueprint $table) {
            $table->bigInteger('user_id')->required()->unsigned()->change();
            $table->foreign('user_id')->references('id')->on('users')->change();
        });
    }
}
