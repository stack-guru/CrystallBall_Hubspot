<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::group(['namespace' => 'App\Http\Controllers', 'as' => 'api.'], function () {

    Route::post('login', 'API\LoginController@login')->name('login')->middleware('cors');
    Route::post('logout', 'API\LoginController@logout')->name('logout')->middleware('cors');

    Route::group(['prefix' => 'v1', 'namespace' => 'API', 'as' => 'v1.'], function () {

        Route::get('event-sources', 'EventSourceController@index')->name('event-sources.index');

        Route::get('chrome-extension/event-sources', 'EventSourceController@index');
        Route::group(['middleware' => ['auth:api']], function () {

            Route::get('user', function (Request $request) {return $request->user();})->name('user.show');
            Route::resource('annotations', 'AnnotationController');

            Route::group(['prefix' => 'chrome-extension', 'as' => 'chrome-extension'], function () {
                Route::get('annotations', 'AnnotationController@extensionIndex');
                Route::get('membership', 'UserController@showMembership');
            });

        });

    });

});
