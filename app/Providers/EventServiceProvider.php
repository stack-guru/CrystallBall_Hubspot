<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        \Illuminate\Auth\Events\Registered::class => [
            \App\Listeners\SeedNotificationSetting::class,
            \Illuminate\Auth\Listeners\SendEmailVerificationNotification::class,
            \App\Listeners\SeedUserDataSource::class,
            \App\Listeners\AddSampleAnnotation::class,
            'App\Listeners\SendAdminNewUserEmail'
        ],
        \Illuminate\Auth\Events\Login::class => [
            'App\Listeners\LoginListener'
        ],

        'Laravel\Passport\Events\AccessTokenCreated' => [
            'App\Listeners\APITokenCreated',
        ],

        \App\Events\UserAddedAnAnnotationViaAPI::class => [
            \App\Listeners\AddAPICreateUsageToApiLog::class
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
