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

Route::view('documentation', 'api/documentation');

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

        Route::get('user', function () {return ['user' => Auth::user()];});
    });

    Route::view('api-key', 'ui/app');
    // GET /oauth/personal-access-tokens to get tokens
    // POST /oauth/personal-access-tokens

});
