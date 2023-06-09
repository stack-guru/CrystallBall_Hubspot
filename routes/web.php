<?php

use App\Http\Controllers\Admin\PricePlanController;
use App\Http\Controllers\AnnotationController;
use App\Http\Controllers\GoogleAnalyticsPropertyController;
use App\Http\Controllers\BitbucketAutomationController;
use App\Http\Controllers\GithubAutomationController;
use App\Http\Controllers\FacebookAutomationController;
use App\Http\Controllers\FacebookTrackingConfigurationController;
use App\Http\Controllers\GoogleTagManagerAutomationController;
use App\Http\Controllers\InstagramAutomationController;
use App\Http\Controllers\InstagramTrackingConfigurationController;
use App\Http\Controllers\KeywordTrackingController;
use App\Http\Controllers\TwitterController;
use App\Http\Controllers\TwitterTrackingConfigurationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YoutubeController;
use App\Http\Controllers\YoutubeMonitorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('test_fb', function () {
    (new \App\Services\FacebookService())->test();
});

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
Route::view('join-company', 'auth.join-company');
Route::view('success-message', 'auth.success');

Route::get('facebookAdsWebhook', [FacebookAutomationController::class, 'facebookAdsWebhookGet']);
Route::post('facebookAdsWebhook', [FacebookAutomationController::class, 'facebookAdsWebhookPost']);

// Route::get('testbrowserdetails', function (Request $request) {
//     try {
//         dd(Browser::browserName(), Browser::platformFamily());
//     } catch (Exception $exception) {
//         dd($exception->getMessage());
//     }
// });

Route::get('requestInvitation', [App\Http\Controllers\Auth\RegisterController::class, 'requestInvitation'])->name('request.invite');
Route::view('invite-sent', 'auth.invite-sent');

Route::get('shared_report/download/{id}', [App\Http\Controllers\Auth\RegisterController::class, 'downloadReport'])->name('shared_report.download');
Route::get('logs4727299@oolkidd9929', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);

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
    Route::group(['middleware' => ['auth']], function () {
        Route::post('generate-password', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'generatePassword'])->name('generate-password');
        Route::post('logout-and-destroy', [App\Http\Controllers\Auth\RegisterController::class, 'logoutAndDestroy'])->name('logout-and-destroy');
    });
});

Route::get('register_chrome', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm']);

Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::post('phone/resend', [App\Http\Controllers\Auth\VerificationController::class, 'resendPhone']);
    Route::post('phone/verify', [App\Http\Controllers\Auth\VerificationController::class, 'verifyPhone']);
});

Route::get('socialite/google', [App\Http\Controllers\Auth\RegisterController::class, 'registerLoginGoogle'])->name('socialite.google');
Route::get('socialite/google/redirect', [App\Http\Controllers\Auth\RegisterController::class, 'registerLoginGoogleRedirect'])->name('socialite.google.redirect');

Route::get('socialite/facebook', [FacebookAutomationController::class, 'redirectFacebook'])->name('facebook.redirect');
Route::get('socialite/facebook/redirect', [FacebookAutomationController::class, 'callbackFacebook'])->name('facebook.callback');

Route::get('socialite/twitter', [TwitterController::class, 'loginRedirect'])->name('twitter.redirect');
Route::get('socialite/twitter/redirect', [TwitterController::class, 'loginCallback'])->name('twitter.callback');

Route::get('socialite/instagram', [InstagramAutomationController::class, 'redirectInstagram'])->name('instagram.redirect');
Route::get('socialite/instagram/redirect', [InstagramAutomationController::class, 'callbackInstagram'])->name('instagram.callback');

Route::get('socialite/bitbucket', [BitbucketAutomationController::class, 'redirectBitbucket'])->name('bitbucket.redirect');
Route::get('socialite/bitbucket/redirect', [BitbucketAutomationController::class, 'callbackBitbucket'])->name('bitbucket.callback');

Route::get('socialite/github', [GithubAutomationController::class, 'redirectGithub'])->name('github.redirect');
Route::get('socialite/github/redirect', [GithubAutomationController::class, 'callbackGithub'])->name('github.callback');

Route::get('socialite/gtm', [GoogleTagManagerAutomationController::class, 'redirectGtm'])->name('gtm.redirect');
Route::get('gtm-redirect', [GoogleTagManagerAutomationController::class, 'callbackGtm'])->name('gtm.callback');

Route::view('documentation', 'documentation');
Route::view('upgrade-plan', 'upgrade-plan')->name('upgrade-plan');
Route::view('upgrade-plan-team', 'upgrade-plan-team')->name('upgrade-plan-team');

// AppSumo Routes
// In middleware auth.identification only identifies user through GET query parameter `identification_code` and logs it in
Route::group(['prefix' => 'app-sumo', 'as' => 'app-sumo.', 'middleware' => ['auth.identification', 'auth', 'verified']], function () {
    Route::get('password', [App\Http\Controllers\AppSumo\AuthController::class, 'showPasswordForm'])->name('password.index');
    Route::put('password', [App\Http\Controllers\AppSumo\AuthController::class, 'updatePassword'])->name('password.update');
});
Route::post('ui/generate-password', [App\Http\Controllers\ConfirmPasswordController::class, 'generatePassword'])->name('generate-password');
Route::group(['middleware' => ['only.non.empty.password', 'auth', 'verified']], function () {
    Route::get('export-statistics',[App\Http\Controllers\Dashboard\AnalyticsController::class, 'export']);
    Route::delete('user', [App\Http\Controllers\HomeController::class, 'deleteAccount'])->withoutMiddleware('only.non.empty.password');

    Route::view('dashboard', 'ui/app'); // obsolete
    Route::view('ga-accounts', 'ui/app');
    Route::view('dashboard/analytics', 'ui/app');
    // Route::view('dashboard/search-console', 'ui/app');

    Route::resource('annotation', App\Http\Controllers\AnnotationController::class)->except(['store', 'show', 'update', 'destroy']);

    Route::view('annotation/upload', 'ui/app');
    Route::post('annotation/upload', [App\Http\Controllers\AnnotationController::class, 'upload']);
    Route::post('annotation/saveCsv', [App\Http\Controllers\AnnotationController::class, 'saveCSV']);

    Route::view('data-source', 'ui/app');
    Route::view('report-dashboard', 'ui/app');

    Route::view('integrations', 'ui/app');
    Route::view('my-integrations', 'ui/app');
    Route::view('api-key', 'ui/app');
    Route::view('notifications', 'ui/app');
    Route::view('analytics-and-business-intelligence', 'ui/app');
    // GET /oauth/personal-access-tokens to get tokens
    // POST /oauth/personal-access-tokens

    Route::get('accounts', [App\Http\Controllers\GoogleAccountController::class, 'index'])->name('accounts');
    Route::group(['prefix' => 'settings'], function () {
        Route::view('/', 'ui/app');
        Route::view('support', 'ui/app');
        Route::view('/devices', 'ui/app');
        Route::view('analytics-accounts', 'ui/app');

        Route::resource('google-account', App\Http\Controllers\GoogleAccountController::class)->only(['create', 'store', 'update', 'destroy']);
        Route::get('google-account/redirect', [App\Http\Controllers\GoogleAccountController::class, 'store'])->name('settings.google-account.redirect.store');

        Route::resource('facebook-accounts', App\Http\Controllers\FacebookAutomationController::class)->only(['index', 'create', 'store', 'update', 'destroy']);

        Route::view('profile', 'ui/app')->name('settings.profile.index');
        Route::view('payment-detail/create', 'ui/app');
        Route::view('price-plans', 'ui/app')->name('settings.price-plans');
        Route::view('custom-price-plan/{code}', 'ui/app')->name('settings.custom-price-plan');

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
                Route::get('users-days-annotations', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'usersDaysAnnotationsIndex']);
                Route::get('media', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'mediaIndex']);
                Route::get('sources', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'sourcesIndex']);
                Route::get('device-categories', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'deviceCategoriesIndex']);
                Route::get('device-by-impression', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'devicesIndexByImpression']);
                Route::get('countries', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'countriesIndex']);
                Route::get('share-report', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'shareReport']);
                Route::get('get-shared-reports', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'getSharedReports']);
                Route::get('get-dashboard-activity', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'getDashboardActivity']);
                Route::get('create-dashboard-activity', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'createDashboardActivity']);
                Route::get('google-analytics-property', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'getAnalyticProperty']);
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

        Route::post('annotations/delete_annotations', [App\Http\Controllers\AnnotationController::class, 'delete_annotations']);
        Route::post('annotations/bulk_delete', [App\Http\Controllers\AnnotationController::class, 'bulk_delete']);

        Route::get('team-name', [App\Http\Controllers\UserController::class, 'getTeamName']);
        Route::get('countries', [App\Http\Controllers\HolidayController::class, 'holidayApi']);
        Route::post('userService', [App\Http\Controllers\HomeController::class, 'userServices']);
        Route::get('annotation-categories', [App\Http\Controllers\AnnotationController::class, 'getCategories']);

        Route::get('user_total_annotations', [AnnotationController::class, 'user_total_annotations']);

        Route::get('get-search-engine-list', [\App\Http\Controllers\DataForSeoController::class, 'getSearchEngineList']);
        Route::get('get-locations-list', [\App\Http\Controllers\DataForSeoController::class, 'getLocationList']);
        Route::get('search-locations-list', [\App\Http\Controllers\DataForSeoController::class, 'searchLocationList']);

        Route::resource('notification-setting', App\Http\Controllers\NotificationSettingController::class)->only(['index', 'update']);

        Route::group(['prefix' => 'data-source'], function () {
            Route::put('mark-data-source-tour', [App\Http\Controllers\HomeController::class, 'markDataSourceTourDone']);
            Route::put('mark-google-accounts-tour', [App\Http\Controllers\HomeController::class, 'markGoogleAccountsTourDone']);

            Route::resource('user-data-source', App\Http\Controllers\UserDataSourceController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::post('user-data-sources', [App\Http\Controllers\UserDataSourceController::class, 'storeAll']);
            Route::post('user-data-sources/delete', [App\Http\Controllers\UserDataSourceController::class, 'deleteAll']);

            Route::get('user-facebook-accounts-exists', [FacebookAutomationController::class, 'userFacebookAccountsExists']);
            Route::get('user-twitter-accounts-exists', [TwitterController::class, 'usertwitterAccountsExists']);
            Route::get('user-instagram-accounts-exists', [InstagramAutomationController::class, 'userInstagramAccountsExists']);
            Route::get('user-bitbucket-accounts-exists', [BitbucketAutomationController::class, 'userBitbucketAccountsExists']);
            Route::get('user-github-accounts-exists', [GithubAutomationController::class, 'userGithubAccountsExists']);

            Route::get('user-keyword-configurations-for-keyword-tracking', [KeywordTrackingController::class, 'userKeywordConfigurationsTotal']);

            Route::resource('web-monitor', App\Http\Controllers\WebMonitorController::class)->only(['index', 'store', 'update', 'destroy']);
            // save dfs keywords for keyword tracking automation
            Route::post('save-keyword-tracking-keywords', [App\Http\Controllers\UserDataSourceController::class, 'saveDFSkeywordsforTracking']);
            // get DFS keywords data
            Route::get('get-keyword-tracking-keywords', [App\Http\Controllers\UserDataSourceController::class, 'getDFSkeywordsforTracking']);
            // delete DFS keyword
            Route::post('delete-keyword-tracking-keyword', [App\Http\Controllers\UserDataSourceController::class, 'deleteDFSkeywordforTracking']);
            // get keyword details
            Route::post('get-keyword-details-for-keyword-tracking', [App\Http\Controllers\UserDataSourceController::class, 'getKeywordTrackingDetailsForKeyword']);
            // update the keyword details
            Route::post('update-keyword-tracking-keyword', [App\Http\Controllers\UserDataSourceController::class, 'updateKeywordTrackingDetailsForKeyword']);

            Route::post('save-facebook-tracking-configurations', [FacebookTrackingConfigurationController::class, 'save']);
            Route::post('run-facebook-job', [FacebookTrackingConfigurationController::class, 'runJob']);
            Route::get('get-facebook-tracking-configurations', [FacebookTrackingConfigurationController::class, 'get']);
            Route::delete('remove-facebook-tracking-configuration/{facebook_tracking_configuration}', [FacebookTrackingConfigurationController::class, 'destroy']);

            Route::post('save-twitter-tracking-configurations', [TwitterTrackingConfigurationController::class, 'save']);
            Route::get('get-twitter-tracking-configurations', [TwitterTrackingConfigurationController::class, 'get']);

            Route::post('save-instagram-tracking-configurations', [InstagramTrackingConfigurationController::class, 'save']);
            Route::post('run-instagram-job', [InstagramTrackingConfigurationController::class, 'runJob']);
            Route::get('get-instagram-tracking-configurations', [InstagramTrackingConfigurationController::class, 'get']);
            Route::delete('remove-instagram-tracking-configuration/{instagram_tracking_configuration}', [InstagramTrackingConfigurationController::class, 'destroy']);

            Route::get('get-facebook-page-list', [App\Http\Controllers\UserFacebookPageController::class, 'index']);

            Route::get('google-algorithm-updates/date', [App\Http\Controllers\GoogleAlgorithmUpdateController::class, 'uiIndex']);
            Route::get('retail-marketing-dates', [App\Http\Controllers\RetailMarketingController::class, 'uiIndex']);
            Route::get('weather-alert/country', [App\Http\Controllers\WeatherAlertController::class, 'uiCountriesIndex']);
            Route::get('weather-alert/city', [App\Http\Controllers\WeatherAlertController::class, 'uiCitiesIndex']);

            Route::post('user-annotation-color', [App\Http\Controllers\UserAnnotationColorController::class, 'store']);
            Route::get('user-annotation-color', [App\Http\Controllers\UserAnnotationColorController::class, 'index']);

            // bitbucket workspaces
            Route::get('get-bitbucket-workspaces', [BitbucketAutomationController::class, 'getWorkspaces']);

            // github repositories
            Route::get('get-github-repositories', [GithubAutomationController::class, 'getRepositories']);
            Route::post('apple_podcast_url', [App\Http\Controllers\ApplePodcastMonitorController::class, 'applePodcastUrl']);

            Route::post('save-youtube-monitor', [YoutubeMonitorController::class, 'save']);
            Route::post('run-youtube-job', [YoutubeMonitorController::class, 'runJob']);
            Route::get('get-youtube-monitor', [YoutubeMonitorController::class, 'get']);
            Route::delete('remove-youtube-monitor/{youtube_monitor}', [YoutubeMonitorController::class, 'destroy']);


            Route::post('shopify_url', [App\Http\Controllers\ShopifyMonitorController::class, 'saveShopifyProducts']);
            Route::get('getShopifyProducts', [App\Http\Controllers\ShopifyMonitorController::class, 'getShopifyProducts']);
            Route::resource('shopify-monitor', App\Http\Controllers\ShopifyMonitorController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource('apple-podcast-monitor', App\Http\Controllers\ApplePodcastMonitorController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::group(['prefix' => 'settings'], function () {
            Route::get('user-active-devices', [UserController::class, 'getUserActiveDevices']);
            Route::post('disconnect-user-device', [UserController::class, 'disconnectUserDevice']);

            Route::get('price-plan-detail', [PricePlanController::class, 'customPricePlanDetailsByCode']);

            Route::post('price-plan/payment', [App\Http\Controllers\PaymentController::class, 'subscribePlan'])->name('payment.check');
            Route::post('price-plan/check-extra-apps', [App\Http\Controllers\PaymentController::class, 'checkExtraApps'])->name('payment.check-extra-apps');
            Route::get('price-plan-subscription', [App\Http\Controllers\PaymentController::class, 'indexPaymentHistory']);
            Route::post('payment-detail', [App\Http\Controllers\PaymentDetailController::class, 'store']);

            Route::get('google-account', [App\Http\Controllers\GoogleAccountController::class, 'uiIndex']);

            Route::get('google-ads-account-ids', [App\Http\Controllers\GoogleAdsAccountController::class, 'uiIndex']);
            Route::put('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'update']);
            Route::delete('google-account/{google_account}', [App\Http\Controllers\GoogleAccountController::class, 'destroy']);
            Route::post('change-password', [App\Http\Controllers\Auth\ResetPasswordController::class, 'updatePassword'])->withoutMiddleware('only.non.empty.password');
            Route::put('change-timezone', [App\Http\Controllers\HomeController::class, 'updateTimezone']);
            Route::put('update-user', [App\Http\Controllers\HomeController::class, 'updateUser']);
            Route::put('change-phone', [App\Http\Controllers\HomeController::class, 'updatePhone']);
            Route::put('change-email', [App\Http\Controllers\HomeController::class, 'updateEmail']);
            Route::post('change-profile', [App\Http\Controllers\HomeController::class, 'updateProfile']);

            Route::get('facebook-accounts', [App\Http\Controllers\FacebookAutomationController::class, 'UIindex']);
            Route::delete('facebook-account/{facebook_account}', [App\Http\Controllers\FacebookAutomationController::class, 'destroy']);

            Route::get('instagram-accounts', [App\Http\Controllers\InstagramAutomationController::class, 'UIindex']);
            Route::delete('instagram-account/{instagram_account}', [App\Http\Controllers\InstagramAutomationController::class, 'destroy']);

            Route::resource('google-analytics-account', App\Http\Controllers\GoogleAnalyticsAccountController::class)->only(['index', 'destroy']);
            Route::post('google-analytics-account/google-account/{google_account}', [App\Http\Controllers\GoogleAnalyticsAccountController::class, 'fetch']);
            Route::post('google-analytics-property/destroy', [App\Http\Controllers\GoogleAnalyticsAccountController::class, 'deleteProperty']);

            Route::resource('google-analytics-property', GoogleAnalyticsPropertyController::class)->only(['index', 'update', 'destroy']);

            Route::resource('google-search-console-site', App\Http\Controllers\GoogleSearchConsoleSiteController::class)->only(['index', 'destroy']);
            Route::post('google-search-console-site/google-account/{google_account}', [App\Http\Controllers\GoogleSearchConsoleSiteController::class, 'fetch']);

            Route::apiResource('user', App\Http\Controllers\UserController::class)->except(['index']);
            Route::get('user', [App\Http\Controllers\UserController::class, 'uiIndex']);
            Route::post('re-invite-user', [App\Http\Controllers\UserController::class, 'reInviteUser']);

            Route::post('support', [App\Http\Controllers\HomeController::class, 'storeSupport']);
        });
        Route::get('price-plan', [App\Http\Controllers\PricePlanController::class, 'uiIndex']);
        Route::get('price-plan/{price_plan}', [App\Http\Controllers\PricePlanController::class, 'show']);
        Route::post('extend-trial', [App\Http\Controllers\PricePlanController::class, 'extendTrial']);
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
