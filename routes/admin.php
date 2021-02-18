<?php
Route::view('/dashboard', 'admin/dashboard')->name('dashboard');
Route::resource('price-plan', App\Http\Controllers\Admin\PricePlanController::class);
Route::resource('user', App\Http\Controllers\Admin\UserController::class)->except(['create', 'store']);

Route::group(['prefix' => 'data-source', 'as' => 'data-source.'], function () {

    Route::get('/', [App\Http\Controllers\Admin\DataSourceController::class, 'index'])->name('index');

    Route::resource('holiday', App\Http\Controllers\Admin\HolidayController::class);
    Route::post('holiday/upload', [App\Http\Controllers\Admin\HolidayController::class, 'upload'])->name('holiday.upload');

    Route::resource('google-algorithm-update', App\Http\Controllers\Admin\GoogleAlgorithmUpdateController::class)->except('show');
    Route::post('google-algorithm-update/upload', [App\Http\Controllers\Admin\GoogleAlgorithmUpdateController::class, 'upload'])->name('google-algorithm-update.upload');
    Route::resource('retail-marketing', App\Http\Controllers\Admin\RetailMarketingController::class);
    Route::post('retail-marketing/upload', [App\Http\Controllers\Admin\RetailMarketingController::class, 'upload'])->name('retail-marketing.upload');
    Route::resource('o-w-m-push-notification', App\Http\Controllers\Admin\OWMPushNotificationController::class)->only(['index', 'show', 'destroy']);

});

Route::resource('coupon', App\Http\Controllers\Admin\CouponController::class);
Route::resource('cookie-coupon', App\Http\Controllers\Admin\CookieCouponController::class);

Route::get('/payment-history', [App\Http\Controllers\Admin\PaymentDetailsController::class, 'paymentHistory'])->name('payment-history');
