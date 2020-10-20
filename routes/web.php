<?php

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

Route::get('app', function () {return view('ui/app');});

Route::group(['middleware' => ['auth']], function () {

    Route::view('dashboard', 'ui/app');
    Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->except('index');
    Route::view('annotation', 'ui/app');
    Route::get('annotation/index', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);
    
});
