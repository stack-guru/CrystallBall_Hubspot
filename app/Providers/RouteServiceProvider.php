<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/annotation';
    /**
     * The name of the route which will render set password page for AppSumo users.
     *
     * 
     *
     * @var string
     */
    public const APP_SUMO_CHANGE_PASSWORD_ROUTE = 'app-sumo.password.index';
    /**
     * The path to the product own website's pricing page.
     *
     * It has to be absolute path.
     *
     * @var string
     */
    public const PRODUCT_WEBSITE_PRICE_PLAN_PAGE = 'https://www.crystalballinsight.com/pricing';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));

            Route::prefix('eapi')
                ->middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/eapi.php'));

            Route::middleware(['web', 'auth:admin'])
                ->prefix("admin")
                ->as("admin.")
                ->namespace($this->namespace)
                ->group(base_path('routes/admin.php'));

            Route::middleware(['web', 'auth:spectator'])
                ->prefix("spectator")
                ->as("spectator.")
                ->namespace($this->namespace)
                ->group(base_path('routes/spectator.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60);
        });
    }
}
