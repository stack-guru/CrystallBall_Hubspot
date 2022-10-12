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

    // Chrome Extension
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

    Route::post('login', 'API\LoginController@login')->name('login')->middleware('cors');
    Route::post('login/google', 'API\LoginController@loginWithGoogle')->name('login.google')->middleware('cors');
    Route::post('logout', 'API\LoginController@logout')->name('logout')->middleware('cors');

    Route::group(['prefix' => 'v1', 'namespace' => 'API', 'as' => 'v1.'], function () {
        Route::post('open-weather-map/alert', 'OWMPushNotificationController@store');
        Route::get('event-sources', 'EventSourceController@index')->name('event-sources.index');

        Route::group(['middleware' => ['auth:api','verified']], function () {

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
                Route::get('google-analytics-properties', 'Zapier\MiscellaneousController@getGoogleAnalyticsProperty');

                Route::resource('user-webhooks', 'Zapier\UserWebhookController')->only(['store', 'destroy']);
            });
        });
    });

    // AppSumo APIs
    Route::group(['prefix' => 'v1/app-sumo', 'namespace' => 'API\AppSumo', 'as' => 'v1.app-sumo.'], function () {
        Route::post('token/generate', 'AuthController@generateToken');

        Route::post('license', 'LicenseController@handler')->middleware('app-sumo.auth');
    });
});
