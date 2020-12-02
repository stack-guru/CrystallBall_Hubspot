<?php
Route::view('/dashboard', 'admin/dashboard')->name('dashboard');
Route::resource('price-plan', App\Http\Controllers\Admin\PricePlanController::class);
Route::resource('user', App\Http\Controllers\Admin\UserController::class)->except(['create', 'store']);
Route::resource('data-source', App\Http\Controllers\Admin\DataSourceController::class);

Route::resource('coupon',App\Http\Controllers\Admin\CouponController::class);
Route::get('/payment-history',[App\Http\Controllers\Admin\PaymentDetailsController::class,'paymentHistory'])->name('payment-history');
