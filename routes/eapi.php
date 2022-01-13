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

    Route::group(['prefix' => 'v1', 'namespace' => 'API', 'as' => 'v1.'], function () {

        Route::group(['prefix' => 'chrome-extension', 'as' => 'chrome-extension.'], function () {

            Route::group(['middleware' => ['auth']], function () {

                Route::get('user', function (Request $request) {
                    return $request->user();
                })->name('user.show');

                Route::get('event-sources', 'EventSourceController@index');
                Route::get('annotations', 'ChromeExtension\AnnotationController@index');
                Route::post('annotations', 'ChromeExtension\AnnotationController@store');
                Route::get('annotations/preview', 'ChromeExtension\AnnotationController@extensionAnnotationPreview');
                Route::get('google-accounts', 'GoogleAccountController@extensionIndex');
                Route::get('google-analytics-accounts', 'GoogleAnalyticsAccountController@extensionIndex');
                Route::get('google-analytics-properties', 'ChromeExtension\GoogleAnalyticsPropertyController@index');
                Route::get('google-annotation/{id}', 'ChromeExtension\GoogleAnalyticsPropertyController@getAnnotations');
                Route::get('memberships', 'UserController@extensionShowMembership');
                Route::get('users', 'ChromeExtension\UserController@index');

                Route::post('log', 'ChromeExtension\ChromeExtensionLogController@store');
            });
        });
    });
});
