<?php
Route::view('/dashboard', 'admin/dashboard')->name('dashboard');
Route::resource('price-plan', App\Http\Controllers\Admin\PricePlanController::class);
Route::resource('user', App\Http\Controllers\Admin\UserController::class)->except(['create', 'store']);


Route::group(['prefix' => 'data-source', 'as' => 'data-source.'], function () {

    Route::get('/', App\Http\Controllers\Admin\DataSourceController::class)->name('index');

    Route::resource('holiday', App\Http\Controllers\Admin\HolidayController::class);

    Route::resource('google-algorithm-update', App\Http\Controllers\Admin\GoogleAlgorithmUpdateController::class)->except('show');

});
Route::resource('coupon',App\Http\Controllers\Admin\CouponController::class);
Route::get('/payment-history',[App\Http\Controllers\Admin\PaymentDetailsController::class,'paymentHistory'])->name('payment-history');
