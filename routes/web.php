<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */
Route::redirect('/', '/login', 301);

Auth::routes();

Route::get('socialite/google', [App\Http\Controllers\Auth\RegisterController::class, 'registerLoginGoogle'])->name('socialite.google');
Route::get('socialite/google/redirect', [App\Http\Controllers\Auth\RegisterController::class, 'registerLoginGoogleRedirect'])->name('socialite.google.redirect');

Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
    Route::get('/login', [App\Http\Controllers\Admin\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [App\Http\Controllers\Admin\LoginController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Admin\LoginController::class, 'logout'])->name('logout');

});

Route::view('documentation', 'documentation');

Route::group(['middleware' => ['auth']], function () {

    Route::view('dashboard', 'ui/app');

    Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->except(['store', 'show', 'update', 'destroy']);

    Route::view('annotation/upload', 'ui/app');
    Route::post('annotation/upload', [App\Http\Controllers\AnnotationController::class, 'upload']);

    Route::view('api-key', 'ui/app');
    Route::view('data-source', 'ui/app');
    Route::view('integrations', 'ui/app');

    // GET /oauth/personal-access-tokens to get tokens
    // POST /oauth/personal-access-tokens

    Route::group(['prefix' => 'settings'], function () {
        Route::view('/', 'ui/app');
        Route::view('support', 'ui/app');

        Route::resource('google-account', App\Http\Controllers\GoogleAccountController::class)->only(['index', 'create', 'store', 'update', 'destroy']);
        Route::get('google-account/redirect', [App\Http\Controllers\GoogleAccountController::class, 'store']);

        Route::view('change-password', 'ui/app');
        Route::view('price-plans', 'ui/app')->name('settings.price-plans');
        Route::get('price-plans/payment', [App\Http\Controllers\PaymentController::class, 'show'])->name('settings.price-plan.payment');
        Route::view('payment-history', 'ui/app');

        Route::view('user', 'ui/app');
        Route::view('user/create', 'ui/app');
        Route::view('user/{id}/edit', 'ui/app');
    });

    Route::group(['prefix' => 'ui'], function () {

        Route::resource('user-data-source', App\Http\Controllers\UserDataSourceController::class)->only(['index', 'store', 'destroy']);

        Route::get('user', [App\Http\Controllers\HomeController::class, 'uiUserShow']);
        Route::get('coupon', [App\Http\Controllers\CouponController::class, 'verify']);
        Route::get('annotation', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);

        Route::get('annotation/{annotation}', [App\Http\Controllers\AnnotationController::class, 'uiShow']);
        Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->only(['store', 'update', 'destroy']);

        Route::get('team-name', [App\Http\Controllers\UserController::class, 'getTeamName']);
        Route::get('countries', [App\Http\Controllers\HolidayController::class, 'holidayApi']);
        Route::post('userService', [App\Http\Controllers\HomeController::class, 'userServices']);
        Route::get('annotation-categories', [App\Http\Controllers\AnnotationController::class, 'getCategories']);
        Route::get('data-source/google-algorithm-updates/date', [App\Http\Controllers\GoogleAlgorithmUpdateController::class, 'uiIndex']);
        Route::get('data-source/retail-marketing-dates', [App\Http\Controllers\RetailMarketingController::class, 'uiIndex']);
        Route::get('data-source/weather-alert/country', [App\Http\Controllers\WeatherAlertController::class, 'uiCountriesIndex']);
        Route::get('data-source/weather-alert/city', [App\Http\Controllers\WeatherAlertController::class, 'uiCitiesIndex']);

        Route::group(['prefix' => 'settings'], function () {

            Route::post('price-plan/payment', [App\Http\Controllers\PaymentController::class, 'subscribePlan'])->name('payment.check');
            Route::get('price-plan-subscription', [App\Http\Controllers\PaymentController::class, 'indexPaymentHistory']);

            Route::get('google-account', [App\Http\Controllers\GoogleAccountController::class, 'uiIndex']);
            Route::put('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'update']);
            Route::delete('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'destroy']);
            Route::post('/change-password', [App\Http\Controllers\Auth\ResetPasswordController::class, 'updatePassword']);

            Route::resource('google-analytics-account', App\Http\Controllers\GoogleAnalyticsAccountController::class)->only(['index', 'destroy']);
            Route::post('google-analytics-account/google-account/{google_account}', [App\Http\Controllers\GoogleAnalyticsAccountController::class, 'fetch']);

            Route::resource('google-analytics-property', App\Http\Controllers\GoogleAnalyticsPropertyController::class)->only(['index', 'destroy']);

            Route::apiResource('user', App\Http\Controllers\UserController::class)->except(['index']);
            Route::get('user', [App\Http\Controllers\UserController::class, 'uiIndex']);

            Route::post('support', [App\Http\Controllers\HomeController::class, 'storeSupport']);
        });
        Route::get('price-plan', [App\Http\Controllers\PricePlanController::class, 'uiIndex']);
        Route::get('price-plan/{price_plan}', [App\Http\Controllers\PricePlanController::class, 'show']);

    });
});
