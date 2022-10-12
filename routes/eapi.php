<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| This file is to be used for reoutes related to chrome extension
| every route will have `web` middleware attached to it by default
| Check RouteServiceProvider for more information
|
|
 */

Route::group(['namespace' => 'App\Http\Controllers', 'as' => 'eapi.', 'middleware' => ['cors']], function () {

    Route::group(['prefix' => 'v1/chrome-extension', 'as' => 'v1.chrome-extension.'], function () {

        Route::group(['middleware' => ['auth:api', 'verified']], function () {

            Route::get('user', function (Request $request) {
                return $request->user();
            })->name('user.show');

            Route::get('event-sources', 'API\EventSourceController@index');
            Route::get('annotations', 'API\ChromeExtension\AnnotationController@index');
            Route::post('annotations', 'API\ChromeExtension\AnnotationController@store');
            Route::get('annotations/preview', 'API\ChromeExtension\AnnotationController@extensionAnnotationPreview');
            Route::get('google-accounts', 'API\GoogleAccountController@extensionIndex');
            Route::get('google-analytics-accounts', 'API\GoogleAnalyticsAccountController@extensionIndex');
            Route::get('google-analytics-properties', 'API\ChromeExtension\GoogleAnalyticsPropertyController@index');
            Route::get('google-annotation/{id}', 'API\ChromeExtension\GoogleAnalyticsPropertyController@getAnnotations');
            Route::get('memberships', 'API\UserController@extensionShowMembership');
            Route::get('users', 'API\ChromeExtension\UserController@index');

            Route::post('log', 'API\ChromeExtension\ChromeExtensionLogController@store');
        });
    });
});
