<?php

use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
Route::resource('price-plan', App\Http\Controllers\Admin\PricePlanController::class);
Route::resource('registration-offer', App\Http\Controllers\Admin\RegistrationOfferController::class);
Route::resource('user', App\Http\Controllers\Admin\UserController::class)->except(['create', 'store']);
Route::resource('spectator', App\Http\Controllers\Admin\SpectatorController::class)->except(['show']);
Route::post('/user/{user}/login', [App\Http\Controllers\Admin\UserController::class, 'login'])->name('user.login');
Route::put('/user/{user}/make-owner', [App\Http\Controllers\Admin\UserController::class, 'makeOwner'])->name('user.make-owner');

Route::group(['prefix' => 'data-source', 'as' => 'data-source.'], function () {

    Route::get('/', [App\Http\Controllers\Admin\DataSourceController::class, 'index'])->name('index');

    Route::resource('holiday', App\Http\Controllers\Admin\HolidayController::class);
    Route::post('holiday/upload', [App\Http\Controllers\Admin\HolidayController::class, 'upload'])->name('holiday.upload');

    Route::resource('google-alert', App\Http\Controllers\Admin\GoogleAlertController::class)->only(['index', 'destroy']);

    Route::resource('google-algorithm-update', App\Http\Controllers\Admin\GoogleAlgorithmUpdateController::class)->except('show');
    Route::post('google-algorithm-update/upload', [App\Http\Controllers\Admin\GoogleAlgorithmUpdateController::class, 'upload'])->name('google-algorithm-update.upload');

    Route::resource('retail-marketing', App\Http\Controllers\Admin\RetailMarketingController::class);
    Route::post('retail-marketing/upload', [App\Http\Controllers\Admin\RetailMarketingController::class, 'upload'])->name('retail-marketing.upload');

    Route::resource('o-w-m-push-notification', App\Http\Controllers\Admin\OWMPushNotificationController::class)->only(['index', 'show', 'destroy']);

    Route::resource('wordpress-update', App\Http\Controllers\Admin\WordpressUpdateController::class)->except('show');
    Route::post('wordpress-update/upload', [App\Http\Controllers\Admin\WordpressUpdateController::class, 'upload'])->name('wordpress-update.upload');
});

Route::resource('coupon', App\Http\Controllers\Admin\CouponController::class);
Route::resource('cookie-coupon', App\Http\Controllers\Admin\CookieCouponController::class);
Route::resource('price-plan-subscription', App\Http\Controllers\Admin\PricePlanSubscriptionController::class)->only(['index', 'show']);
Route::get('web-monitor', [App\Http\Controllers\Admin\WebMonitorController::class, 'index'])->name('web-monitor.index');
Route::delete('web-monitor/{webMonitor}', [App\Http\Controllers\Admin\WebMonitorController::class, 'destroy'])->name('web-monitor.destroy');
Route::get('auto-payment-log', [App\Http\Controllers\Admin\AutoPaymentLogController::class, 'index'])->name('auto-payment-log.index');
Route::get('payment-detail', [App\Http\Controllers\Admin\PaymentDetailController::class, 'index'])->name('payment-detail.index');

Route::get('deduct-payment/create', [App\Http\Controllers\Admin\DeductPaymentController::class, 'create'])->name('deduct-payment.create');
Route::post('deduct-payment', [App\Http\Controllers\Admin\DeductPaymentController::class, 'store'])->name('deduct-payment.store');

Route::resource('checklist-item', App\Http\Controllers\Admin\ChecklistItemController::class);
Route::get('user-startup-configuration', [App\Http\Controllers\Admin\UserStartupConfigurationController::class, 'index'])->name('user-startup-configuration.index');

Route::group(['prefix' => 'reports', 'as' => 'reports.'], function () {
    Route::get('user-active-report', [App\Http\Controllers\Admin\ReportsController::class, 'showUserActiveReport'])->name('user-active-report.show');
    Route::get('user-ga-info/{user}', [App\Http\Controllers\Admin\ReportsController::class, 'showUserGAInfo'])->name('user-ga-info.show');

    Route::get('user-annotation-list', [App\Http\Controllers\Admin\ReportsController::class, 'userAnnotationListForReport'])->name('user-annotation-list.show');
    Route::get('user-annotation-list-view-update', [App\Http\Controllers\Admin\ReportsController::class, 'userAnnotationListForReportUpdateView'])->name('user-annotation-list-view-update');

});

Route::get('chrome-extension-log', [App\Http\Controllers\Admin\ChromeExtensionLogController::class, 'index'])->name('chrome-extension-log.index');
Route::get('login-log', [App\Http\Controllers\Admin\LoginLogController::class, 'index'])->name('login-log.index');
Route::get('api-log', [App\Http\Controllers\Admin\ApiLogController::class, 'index'])->name('api-log.index');
