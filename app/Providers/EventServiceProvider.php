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
            'App\Listeners\SendAdminNewUserEmail',
            \App\Listeners\AddUserToSendGridList::class,
        ],
        \Illuminate\Auth\Events\Login::class => [
            'App\Listeners\LoginListener',
        ],

        'Laravel\Passport\Events\AccessTokenCreated' => [
            'App\Listeners\APITokenCreated',
        ],

        \App\Events\UserAddedAnAnnotationViaAPI::class => [\App\Listeners\AddAPIUsageToApiLog::class],

        \App\Events\NewCSVFileUploaded::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\HolidaysDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\GoogleUpdatesActivated::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\GoogleUpdatesDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\GoogleAlertDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\RetailMarketingDatesActivated::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\RetailMarketingDatesDeactivated::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\WeatherForCitiesDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\WebsiteMonitoringDeactivated::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\WordPressActivated::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\WordPressDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],

        \App\Events\UserUsedApiForFirstTime::class => [\App\Listeners\AddUserToSendGridList::class],

        \App\Events\UserTrialPricePlanEnded::class => [\App\Listeners\AddUserToSendGridList::class],

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
