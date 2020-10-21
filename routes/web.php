<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AnnotationController;
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

Route::group(['middleware' => ['auth']], function () {

    Route::view('dashboard', 'ui/app');
    Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->except('show');
    Route::get('annotation/index', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);

});
Route::get('main',function(){
    return view('annotation/index');
});
