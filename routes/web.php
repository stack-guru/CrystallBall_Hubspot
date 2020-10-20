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

<<<<<<< HEAD
Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
=======
Route::get('app', function () {return view('ui/app');});
>>>>>>> a947540589b514877f49c9810e67d350c4e7e42b

Route::group(['middleware' => ['auth']], function () {

<<<<<<< HEAD
Route::resource('annotation', AnnotationController::class);
=======
    Route::view('dashboard', 'ui/app');
    Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->except('index');
    Route::view('annotation', 'ui/app');
    Route::get('annotation/index', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);

});
>>>>>>> a947540589b514877f49c9810e67d350c4e7e42b
