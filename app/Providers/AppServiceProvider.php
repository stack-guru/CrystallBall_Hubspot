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
                config(['mail.from' => ['address' => 'contact@gaannotations.com', 'name' => 'GAannotations']]);
                break;

            case 'app.crystalballinsight.com':
                config(['app.name' => 'Crystal Ball Insight Ltd', 'app.url' => 'https://app.crystalballinsight.com']);
                config(['app.icon' => asset('/favicon-cbi.ico'), 'app.logo' => asset('/images/company_logo_cbi.png')]);
                config(['mail.from' => ['address' => 'contact@crystalballinsight.com', 'name' => 'Crystal Ball Insight Ltd']]);
                break;

            case 'localhost':
                config(['app.name' => 'GAannotations', 'app.url' => 'http://localhost']);
                config(['app.icon' => asset('/favicon-gaa.ico'), 'app.logo' => asset('/images/company_logo_gaa.png')]);
                config(['mail.from' => ['address' => 'contact@gaannotations.com', 'name' => 'GAannotations']]);
                break;

            case '127.0.0.1':
                config(['app.name' => 'Crystal Ball Insight Ltd', 'app.url' => 'http://127.0.0.1']);
                config(['app.icon' => asset('/favicon-cbi.ico'), 'app.logo' => asset('/images/company_logo_cbi.png')]);
                config(['mail.from' => ['address' => 'contact@crystalballinsight.com', 'name' => 'Crystal Ball Insight Ltd']]);
                break;
        }

        // Setting Google Sign-On Redirect URL to support both domain logins
        \Illuminate\Support\Env::getRepository()->set('GOOGLE_CLIENT_REDIRECT_URI', url('/settings/google-account/redirect'));
    }
}
