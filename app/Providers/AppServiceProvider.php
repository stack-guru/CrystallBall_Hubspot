<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Paginator::useBootstrap();
        Schema::defaultStringLength(191);

        switch (request()->getHost()) {
            case 'app.gaannotations.com':
                config(['app.name' => 'GAannotations', 'app.url' => 'https://app.gaannotations.com']);
                break;

            case 'app.crystalballinsight.com':
                config(['app.name' => 'CrystalBallInsight', 'app.url' => 'https://app.crystalballinsight.com']);
                break;

            case 'localhost':
                config(['app.name' => 'GALocal', 'app.url' => 'http://localhost']);
                break;

            case '127.0.0.1':
                config(['app.name' => 'GAIP', 'app.url' => 'http://127.0.0.1']);
                break;
        }
    }
}
