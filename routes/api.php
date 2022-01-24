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
    Route::post('login/google', 'API\LoginController@loginWithGoogle')->name('login.google')->middleware('cors');
    Route::post('logout', 'API\LoginController@logout')->name('logout')->middleware('cors');

    Route::group(['prefix' => 'v1', 'namespace' => 'API', 'as' => 'v1.'], function () {
        Route::post('open-weather-map/alert', 'OWMPushNotificationController@store');
        Route::get('event-sources', 'EventSourceController@index')->name('event-sources.index');

        Route::group(['middleware' => ['auth:api']], function () {

            Route::get('user', function (Request $request) {
                return $request->user();
            })->name('user.show');
            Route::resource('annotations', 'AnnotationController');

            Route::group(['prefix' => 'microsoft-power-bi', 'as' => 'microsoft-power-bi.'], function () {
                Route::get('annotations', 'MicrosoftPowerBI\AnnotationController@index');
            });
            Route::group(['prefix' => 'google-data-studio', 'as' => 'google-data-studio.'], function () {
                Route::get('annotations', 'GoogleDataStudio\AnnotationController@index');
            });

            Route::group(['prefix' => 'zapier', 'as' => 'zapier.'], function () {
                Route::post('annotations', 'Zapier\AnnotationController@store');
                Route::get('annotations', 'Zapier\AnnotationController@index');

                Route::resource('user-webhooks', 'Zapier\UserWebhookController')->only(['store', 'destroy']);
            });
        });
    });

    // AppSumo APIs
    Route::group(['prefix' => 'v1/app-sumo', 'namespace' => 'API/AppSumo', 'as' => 'v1.app-sumo.'], function () {
        Route::post('token/generate', 'AuthController@generateToken');

        Route::post('license', 'LicenseController@handler');
    });
});
