<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

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

        Route::get('csrf-cookie', function (Request $request) {
            if ($request->expectsJson()) {
                return new JsonResponse(['token' => csrf_token()], 200);
            }
            return new Response(csrf_token(), 200);
        });

        Route::post('login', 'API\ChromeExtension\LoginController@login')->middleware(['prevent.cache', 'guest'])->name('login');
        Route::post('login/google', 'API\ChromeExtension\LoginController@loginWithGoogle')->middleware(['prevent.cache', 'guest'])->name('login.google');

        Route::post('logout', 'API\ChromeExtension\LoginController@logout')->middleware(['auth', 'prevent.cache'])->name('logout');
        Route::group(['middleware' => ['web']], function () {

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

            Route::get('annotation-categories', [App\Http\Controllers\API\ChromeExtension\AnnotationController::class, 'getCategories']);

            Route::post('log', 'API\ChromeExtension\ChromeExtensionLogController@store');
        });
    });
});
