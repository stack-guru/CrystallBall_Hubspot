<?php

use App\Http\Controllers\AnnotationController;
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

    Route::group(['prefix' => 'ui'], function () {
        Route::get('user', [App\Http\Controllers\HomeController::class, 'uiUserShow']);

        Route::get('coupon', [App\Http\Controllers\CouponController::class, 'verify']);

        Route::get('annotation', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);

        Route::post('annotation', [App\Http\Controllers\AnnotationController::class, 'store']);
        Route::get('annotation/{id}', [App\Http\Controllers\AnnotationController::class, 'uiShow']);
        Route::put('annotation/{id}', [App\Http\Controllers\AnnotationController::class, 'update']);
        Route::delete('annotation/{annotation}', [App\Http\Controllers\AnnotationController::class, 'destroy']);

        Route::group(['prefix' => 'settings'], function () {

            Route::post('price-plan/payment', [App\Http\Controllers\PaymentController::class, 'subscribePlan'])->name('payment.check');
            Route::get('price-plan-subscription', [App\Http\Controllers\PaymentController::class, 'indexPaymentHistory']);

            Route::get('google-account', [App\Http\Controllers\GoogleAccountController::class, 'uiIndex']);
            Route::delete('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'destroy']);
            Route::post('/change-password',[App\Http\Controllers\Auth\ResetPasswordController::class,'updatePassword']);
        });
        Route::get('price-plan', [App\Http\Controllers\PricePlanController::class, 'uiIndex']);
        Route::get('price-plan/{price_plan}', [App\Http\Controllers\PricePlanController::class, 'show']);

    });

    Route::view('api-key', 'ui/app');
    Route::view('data-source', 'ui/app');
    Route::view('integrations', 'ui/app');

    // GET /oauth/personal-access-tokens to get tokens
    // POST /oauth/personal-access-tokens

    Route::group(['prefix' => 'settings'], function () {
        Route::view('/', 'ui/app');

        Route::resource('google-account', App\Http\Controllers\GoogleAccountController::class)->except(['store', 'show', 'update', 'edit', 'destroy']);
        Route::get('google-account/redirect', [App\Http\Controllers\GoogleAccountController::class, 'store']);

        Route::view('change-password', 'ui/app');
        Route::view('price-plans', 'ui/app');
        Route::get('price-plans/payment', [App\Http\Controllers\PaymentController::class, 'show'])->name('settings.price-plan.payment');
        Route::view('payment-history', 'ui/app');
    });

});
