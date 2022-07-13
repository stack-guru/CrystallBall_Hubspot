<?php

use App\Http\Controllers\KeywordTrackingController;
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

Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
    Route::get('/login', [App\Http\Controllers\Admin\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [App\Http\Controllers\Admin\LoginController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Admin\LoginController::class, 'logout'])->name('logout');
});

Route::group(['prefix' => 'spectator', 'as' => 'spectator.'], function () {
    Route::get('/login', [App\Http\Controllers\Spectator\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [App\Http\Controllers\Spectator\LoginController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Spectator\LoginController::class, 'logout'])->name('logout');
});

Route::redirect('/', '/login', 301);

Route::group(['middleware' => ['prevent.cache']], function () {
    Auth::routes(['verify' => true]);
});

Route::get('register_chrome', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm']);

Route::group(['middleware' => ['auth']], function () {
    Route::post('phone/resend', [App\Http\Controllers\Auth\VerificationController::class, 'resendPhone']);
    Route::post('phone/verify', [App\Http\Controllers\Auth\VerificationController::class, 'verifyPhone']);
});

Route::get('socialite/google', [App\Http\Controllers\Auth\RegisterController::class, 'registerLoginGoogle'])->name('socialite.google');
Route::get('socialite/google/redirect', [App\Http\Controllers\Auth\RegisterController::class, 'registerLoginGoogleRedirect'])->name('socialite.google.redirect');

Route::view('documentation', 'documentation');
Route::view('upgrade-plan', 'upgrade-plan')->name('upgrade-plan');

// AppSumo Routes
// In middleware auth.identification only identifies user through GET query parameter `identification_code` and logs it in
Route::group(['prefix' => 'app-sumo', 'as' => 'app-sumo.', 'middleware' => ['auth.identification', 'auth']], function () {
    Route::get('password', [App\Http\Controllers\AppSumo\AuthController::class, 'showPasswordForm'])->name('password.index');
    Route::put('password', [App\Http\Controllers\AppSumo\AuthController::class, 'updatePassword'])->name('password.update');
});

Route::group(['middleware' => ['only.non.empty.password', 'auth']], function () {

    Route::delete('user', [App\Http\Controllers\HomeController::class, 'deleteAccount'])->withoutMiddleware('only.non.empty.password');

    Route::view('dashboard', 'ui/app'); // obsolete
    Route::view('analytics', 'ui/app');
    Route::view('dashboard/analytics', 'ui/app');
    Route::view('dashboard/search-console', 'ui/app');

    Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->except(['store', 'show', 'update', 'destroy']);

    Route::view('annotation/upload', 'ui/app');
    Route::post('annotation/upload', [App\Http\Controllers\AnnotationController::class, 'upload']);

    Route::view('data-source', 'ui/app');
    Route::view('integrations', 'ui/app');
    Route::view('my-integrations', 'ui/app');
    Route::view('api-key', 'ui/app');
    Route::view('notifications', 'ui/app');
    Route::view('analytics-and-business-intelligence', 'ui/app');

    // GET /oauth/personal-access-tokens to get tokens
    // POST /oauth/personal-access-tokens

    Route::group(['prefix' => 'settings'], function () {
        Route::view('/', 'ui/app');
        Route::view('support', 'ui/app');

        Route::resource('google-account', App\Http\Controllers\GoogleAccountController::class)->only(['index', 'create', 'store', 'update', 'destroy']);
        Route::get('google-account/redirect', [App\Http\Controllers\GoogleAccountController::class, 'store'])->name('settings.google-account.redirect.store');

        Route::view('change-password', 'ui/app')->name('settings.change-password.index');
        Route::view('payment-detail/create', 'ui/app');
        Route::view('price-plans', 'ui/app')->name('settings.price-plans');
        Route::get('price-plans/payment', [App\Http\Controllers\PaymentController::class, 'show'])->name('settings.price-plan.payment');
        Route::view('payment-history', 'ui/app');

        Route::view('user', 'ui/app');
        Route::view('user/create', 'ui/app');
        Route::view('user/{id}/edit', 'ui/app');
    });

    Route::group(['prefix' => 'ui'], function () {

        Route::group(['prefix' => 'dashboard'], function () {
            Route::group(['prefix' => 'analytics'], function () {
                Route::get('top-statistics', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'topStatisticsIndex']);
                Route::get('annotations-metrics-dimensions', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'annotationsMetricsDimensionsIndex']);
                Route::get('users-days', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'usersDaysIndex']);
                Route::get('users-days', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'usersDaysIndex']);
                Route::get('users-days-annotations', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'usersDaysAnnotationsIndex']);
                Route::get('media', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'mediaIndex']);
                Route::get('sources', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'sourcesIndex']);
                Route::get('device-categories', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'deviceCategoriesIndex']);
            });

            Route::group(['prefix' => 'search-console'], function () {
                Route::get('top-statistics', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'topStatisticsIndex']);
                Route::get('queries', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'queriesIndex']);
                Route::get('pages', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'pagesIndex']);
                Route::get('countries', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'countriesIndex']);
                Route::get('devices', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'devicesIndex']);
                Route::get('search-appearances', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'searchAppearancesIndex']);
                Route::get('annotations-dates', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'annotationsDatesIndex']);
                Route::get('clicks-impressions-days-annotations', [App\Http\Controllers\Dashboard\SearchConsoleController::class, 'clicksImpressionsDaysAnnotationsIndex']);
            });
        });

        Route::post('user-startup-configuration', [App\Http\Controllers\UserStartupConfigurationController::class, 'store']);
        Route::resource('user-checklist-item', App\Http\Controllers\UserChecklistItemController::class)->only(['index', 'update']);

        Route::get('user', [App\Http\Controllers\HomeController::class, 'uiUserShow'])->withoutMiddleware('only.non.empty.password');
        Route::get('coupon', [App\Http\Controllers\CouponController::class, 'verify']);
        Route::get('annotation', [App\Http\Controllers\AnnotationController::class, 'uiIndex']);

        Route::get('annotation/{annotation}', [App\Http\Controllers\AnnotationController::class, 'uiShow']);
        Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->only(['store', 'update', 'destroy']);

        Route::post('annotations/bulk_delete', [App\Http\Controllers\AnnotationController::class, 'bulk_delete']);

        Route::get('team-name', [App\Http\Controllers\UserController::class, 'getTeamName']);
        Route::get('countries', [App\Http\Controllers\HolidayController::class, 'holidayApi']);
        Route::post('userService', [App\Http\Controllers\HomeController::class, 'userServices']);
        Route::get('annotation-categories', [App\Http\Controllers\AnnotationController::class, 'getCategories']);

        Route::get('get-search-engine-list', [\App\Http\Controllers\DataForSeoController::class, 'getSearchEngineList']);
        Route::get('get-locations-list', [\App\Http\Controllers\DataForSeoController::class, 'getLocationList']);
        Route::get('search-locations-list', [\App\Http\Controllers\DataForSeoController::class, 'searchLocationList']);

        Route::resource('notification-setting', App\Http\Controllers\NotificationSettingController::class)->only(['index', 'update']);

        Route::group(['prefix' => 'data-source'], function () {
            Route::put('mark-data-source-tour', [App\Http\Controllers\HomeController::class, 'markDataSourceTourDone']);
            Route::put('mark-google-accounts-tour', [App\Http\Controllers\HomeController::class, 'markGoogleAccountsTourDone']);

            Route::resource('user-data-source', App\Http\Controllers\UserDataSourceController::class)->only(['index', 'store', 'destroy']);

            Route::get('user-keyword-configurations-for-keyword-tracking', [KeywordTrackingController::class, 'userKeywordConfigurationsTotal']);

            Route::resource('web-monitor', App\Http\Controllers\WebMonitorController::class)->only(['index', 'store', 'update', 'destroy']);
            // save dfs keywords for keyword tracking automation
            Route::post('save-keyword-tracking-keywords', [App\Http\Controllers\UserDataSourceController::class, 'saveDFSkeywordsforTracking']);
            // get DFS keywords data
            Route::get('get-keyword-tracking-keywords', [App\Http\Controllers\UserDataSourceController::class, 'getDFSkeywordsforTracking']);
            // delete DFS keyword
            Route::post('delete-keyword-tracking-keyword', [App\Http\Controllers\UserDataSourceController::class, 'deleteDFSkeywordforTracking']);


            Route::get('google-algorithm-updates/date', [App\Http\Controllers\GoogleAlgorithmUpdateController::class, 'uiIndex']);
            Route::get('retail-marketing-dates', [App\Http\Controllers\RetailMarketingController::class, 'uiIndex']);
            Route::get('weather-alert/country', [App\Http\Controllers\WeatherAlertController::class, 'uiCountriesIndex']);
            Route::get('weather-alert/city', [App\Http\Controllers\WeatherAlertController::class, 'uiCitiesIndex']);

            Route::post('user-annotation-color', [App\Http\Controllers\UserAnnotationColorController::class, 'store']);
            Route::get('user-annotation-color', [App\Http\Controllers\UserAnnotationColorController::class, 'index']);
        });

        Route::group(['prefix' => 'settings'], function () {

            Route::post('price-plan/payment', [App\Http\Controllers\PaymentController::class, 'subscribePlan'])->name('payment.check');
            Route::get('price-plan-subscription', [App\Http\Controllers\PaymentController::class, 'indexPaymentHistory']);
            Route::post('payment-detail', [App\Http\Controllers\PaymentDetailController::class, 'store']);

            Route::get('google-account', [App\Http\Controllers\GoogleAccountController::class, 'uiIndex']);
            Route::get('google-ads-account-ids', [App\Http\Controllers\GoogleAdsAccountController::class, 'uiIndex']);
            Route::put('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'update']);
            Route::delete('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'destroy']);
            Route::post('change-password', [App\Http\Controllers\Auth\ResetPasswordController::class, 'updatePassword'])->withoutMiddleware('only.non.empty.password');
            Route::put('change-timezone', [App\Http\Controllers\HomeController::class, 'updateTimezone']);
            Route::put('change-phone', [App\Http\Controllers\HomeController::class, 'updatePhone']);

            Route::resource('google-analytics-account', App\Http\Controllers\GoogleAnalyticsAccountController::class)->only(['index', 'destroy']);
            Route::post('google-analytics-account/google-account/{google_account}', [App\Http\Controllers\GoogleAnalyticsAccountController::class, 'fetch']);

            Route::resource('google-analytics-property', App\Http\Controllers\GoogleAnalyticsPropertyController::class)->only(['index', 'destroy']);

            Route::resource('google-search-console-site', App\Http\Controllers\GoogleSearchConsoleSiteController::class)->only(['index', 'destroy']);
            Route::post('google-search-console-site/google-account/{google_account}', [App\Http\Controllers\GoogleSearchConsoleSiteController::class, 'fetch']);

            Route::apiResource('user', App\Http\Controllers\UserController::class)->except(['index']);
            Route::get('user', [App\Http\Controllers\UserController::class, 'uiIndex']);

            Route::post('support', [App\Http\Controllers\HomeController::class, 'storeSupport']);
        });
        Route::get('price-plan', [App\Http\Controllers\PricePlanController::class, 'uiIndex']);
        Route::get('price-plan/{price_plan}', [App\Http\Controllers\PricePlanController::class, 'show']);
    });

    Route::get('/beaming/auth', function () {
        $userID = Auth::id();

        $beamsClient = new \Pusher\PushNotifications\PushNotifications(
            array(
                "instanceId" => config('services.pusher.beams_instance_id'),
                "secretKey" => config('services.pusher.beams_secret_key'),
            )
        );

        if ($userID != request()->query('user_id')) {
            return response('Inconsistent request', 401);
        } else {
            $beamsToken = $beamsClient->generateToken((string) $userID);
            return response()->json($beamsToken);
        }
    });
});
