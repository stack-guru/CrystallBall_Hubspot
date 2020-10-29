<?php
Route::view('/dashboard', 'admin/dashboard')->name('dashboard');
Route::resource('price-plan', App\Http\Controllers\Admin\PricePlanController::class);
