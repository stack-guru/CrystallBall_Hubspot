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
                config(['app.icon' => asset('/favicon-gaa.ico'), 'app.logo' => asset('/images/company_logo_gaa.png')]);
                break;

            case 'app.crystalballinsight.com':
                config(['app.name' => 'Crystal Ball', 'app.url' => 'https://app.crystalballinsight.com']);
                config(['app.icon' => asset('/favicon-cbi.ico'), 'app.logo' => asset('/images/company_logo_cbi.png')]);
                break;

            case 'localhost':
                config(['app.name' => 'GALocal', 'app.url' => 'http://localhost']);
                config(['app.icon' => asset('/favicon-gaa.ico'), 'app.logo' => asset('/images/company_logo_gaa.png')]);
                break;

            case '127.0.0.1':
                config(['app.name' => 'GAIP', 'app.url' => 'http://127.0.0.1']);
                config(['app.icon' => asset('/favicon-cbi.ico'), 'app.logo' => asset('/images/company_logo_cbi.png')]);
                break;
        }
    }
}
