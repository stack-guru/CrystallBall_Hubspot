<?php

namespace App\Providers;

use App\Events\UserDataSourceUpdatedOrCreated;
use App\Events\UserLoggedInEvent;
use App\Listeners\RetrieveDFSTaskIdForKeyword;
use App\Listeners\UpdateUserSessionListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

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
            // \Illuminate\Auth\Listeners\SendEmailVerificationNotification::class,
            \App\Listeners\SeedUserDataSource::class,
            \App\Listeners\AddSampleAnnotation::class,
            // \App\Listeners\SendAdminNewUserEmail::class,
            \App\Listeners\AddUserToSendGridList::class,
            \App\Listeners\CreateUserRegistrationOffer::class,
        ],

        \App\Events\RegisteredNewUser::class => [
            \App\Listeners\SendEmailVerificationMail::class,
            \App\Listeners\SendAdminNewUserEmail::class
        ],

        \Illuminate\Auth\Events\Login::class => [
            'App\Listeners\LoginListener',
        ],

        'Laravel\Passport\Events\AccessTokenCreated' => [
            'App\Listeners\APITokenCreated',
            \App\Listeners\MarkChecklistItemCompleted::class
        ],

        \App\Events\AnnotationCreated::class => [\App\Listeners\TriggerZapierWebHooks::class],
        \App\Events\UserAddedAnAnnotationViaAPI::class => [\App\Listeners\AddAPIUsageToApiLog::class],

        \App\Events\ChromeExtensionFirstAnnotationCreated::class => [
            \App\Listeners\AddUserToSendGridList::class,
        ],

        \App\Events\UserClickedAnnotationButtonInBrowser::class => [
            \App\Listeners\AddUserToSendGridList::class,
        ],

        \App\Events\NewCSVFileUploaded::class => [
            \App\Listeners\AddUserToSendGridList::class,
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\HolidaysActivated::class => [
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\HolidaysDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\GoogleAlertActivated::class => [
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\GoogleUpdatesActivated::class => [
            \App\Listeners\AddUserToSendGridList::class,
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\GoogleUpdatesDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\GoogleAlertDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\RetailMarketingDatesActivated::class => [
            \App\Listeners\AddUserToSendGridList::class,
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\RetailMarketingDatesDeactivated::class => [\App\Listeners\AddUserToSendGridList::class],
        \App\Events\WeatherActivated::class => [
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\WeatherForCitiesDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],

        \App\Events\WebsiteMonitoringActivated::class => [
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\WebsiteMonitoringDeactivated::class => [\App\Listeners\AddUserToSendGridList::class],

        \App\Events\WordPressActivated::class => [
            \App\Listeners\AddUserToSendGridList::class,
            \App\Listeners\MarkChecklistItemCompleted::class
        ],
        \App\Events\WordPressDeactivatedManually::class => [\App\Listeners\AddUserToSendGridList::class],

        \App\Events\UserUsedApiForFirstTime::class => [
            \App\Listeners\AddUserToSendGridList::class,
            \App\Listeners\MarkChecklistItemCompleted::class
        ],

        \App\Events\UserTrialPricePlanEnded::class => [
            \App\Listeners\AddUserToSendGridList::class,
            // \App\Listeners\SendTrialEndedEmail::class,
        ],

        \App\Events\UserInvitedTeamMember::class => [
            \App\Listeners\MarkChecklistItemCompleted::class
        ],

        \App\Events\AnnotationsLimitReached::class => [\App\Listeners\AddUserToSendGridList::class],

        /*
         * Retrieve Task ID and store for CronJob
         * */
        UserDataSourceUpdatedOrCreated::class => [
            RetrieveDFSTaskIdForKeyword::class
        ],

        \SocialiteProviders\Manager\SocialiteWasCalled::class => [
            // ... other providers
            \SocialiteProviders\InstagramBasic\InstagramBasicExtendSocialite::class.'@handle',
        ],

        \SocialiteProviders\Manager\SocialiteWasCalled::class => [
            // ... other providers
            \SocialiteProviders\Instagram\InstagramExtendSocialite::class.'@handle',
        ],

        UserLoggedInEvent::class => [
            UpdateUserSessionListener::class,
        ]

    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        \App\Models\Annotation::observe(\App\Observers\AnnotationObserver::class);
        // UserDataSource::observe(UserDataSourceObserver::class);
    }
}
