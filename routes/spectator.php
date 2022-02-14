<?php
Route::get('/dashboard', [App\Http\Controllers\Spectator\DashboardController::class, 'index'])->name('dashboard');

Route::resource('price-plan-subscription', App\Http\Controllers\Spectator\PricePlanSubscriptionController::class)->only(['index', 'show']);
Route::get('auto-payment-log', [App\Http\Controllers\Spectator\AutoPaymentLogController::class, 'index'])->name('auto-payment-log.index');

Route::group(['prefix' => 'reports', 'as' => 'reports.'], function () {
    Route::get('user-active-report', [App\Http\Controllers\Spectator\ReportsController::class, 'showUserActiveReport'])->name('user-active-report.show');
});
