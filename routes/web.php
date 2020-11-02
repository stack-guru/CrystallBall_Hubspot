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
        Route::get('annotation', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);
        Route::post('annotation', [App\Http\Controllers\AnnotationController::class, 'store']);
        Route::get('annotation/{id}', [App\Http\Controllers\AnnotationController::class, 'uiShow']);
        Route::put('annotation/{id}', [App\Http\Controllers\AnnotationController::class, 'update']);
        Route::delete('annotation/{annotation}', [App\Http\Controllers\AnnotationController::class, 'destroy']);
        Route::post('settings/price-plan/payment', [App\Http\Controllers\PaymentController::class, 'subscribePlan'])->name('payment.check');
        Route::post('settings/price-plan/downGrade', [App\Http\Controllers\PaymentController::class, ''])->name('payment.check');

        Route::get('user', function () {
            $user = Auth::user();
            $user->load('pricePlan');
            return ['user' => $user];
        });

        Route::get('price-plan', [App\Http\Controllers\PricePlanController::class, 'uiIndex']);
        Route::get('price-plan/{price_plan}', [App\Http\Controllers\PricePlanController::class, 'show']);

    });

    Route::view('api-key', 'ui/app');
    // GET /oauth/personal-access-tokens to get tokens
    // POST /oauth/personal-access-tokens

    Route::view('settings', 'ui/app');
    Route::view('settings/change-password', 'ui/app');
    Route::view('settings/price-plans', 'ui/app');
    Route::view('settings/price-plans/payment', 'ui/app')->name('settings.price-plan.payment');


});

