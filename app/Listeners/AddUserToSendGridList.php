<?php

namespace App\Listeners;

use App\Services\SendGridService;
use Illuminate\Contracts\Queue\ShouldQueue;
// implements ShouldQueue
class AddUserToSendGridList 
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $sGS = new SendGridService;

        switch (get_class($event)) {
                /////////////////////////////////////////////////////
                // New Registration
            case 'Illuminate\Auth\Events\Registered':
                $sGS->addUserToMarketingList($event->user, "1 GAa New registrations");
                break;

                /////////////////////////////////////////////////////
                // Data Source Events
            case 'App\Events\NewCSVFileUploaded':
                $sGS->addUserToContactList($event->user, "New CSV [file name] Uploaded", ['w13_T' => $event->fileName]);
                break;
            case 'App\Events\HolidaysDeactivatedManually':
                $sGS->addUserToContactList($event->user, "Holidays for [Country_name] Deactivated manually");
                break;
            case 'App\Events\GoogleUpdatesActivated':
                $sGS->addUserToContactList($event->user, "Google Updates Activated");
                break;
            case 'App\Events\GoogleUpdatesDeactivatedManually':
                $sGS->addUserToContactList($event->user, "Google Updates Deactivated manually");
                break;
            case 'App\Events\RetailMarketingDatesActivated':
                $sGS->addUserToContactList($event->user, "Retail Marketing Dates Activated");
                break;
            case 'App\Events\RetailMarketingDatesDeactivated':
                $sGS->addUserToContactList($event->user, "Retail Marketing Dates Deactivated manually");
                break;
            case 'App\Events\WeatherForCitiesDeactivatedManually':
                $sGS->addUserToContactList($event->user, "Weather for [cities] Deactivated manually");
                break;
            case 'App\Events\WordPressActivated':
                $sGS->addUserToContactList($event->user, "WordPress Activated");
                break;
            case 'App\Events\WordPressDeactivatedManually':
                $sGS->addUserToContactList($event->user, "WordPress Deactivated manually");
                break;
            case 'App\Events\WebsiteMonitoringDeactivated':
                $sGS->addUserToContactList($event->user, "Website Monitoring Deactivated because URL was removed");
                break;
            case 'App\Events\GoogleAlertDeactivatedManually':
                $sGS->addUserToContactList($event->user, "News Alerts for [keywords] Deactivated manually");
                break;

                /////////////////////////////////////////////////////
                // Marketing Lists
            case 'App\Events\UserUsedApiForFirstTime':
                $sGS->addUserToMarketingList($event->user, "14 GAa API users");
                break;

            case 'App\Events\UserTrialPricePlanEnded':
                $sGS->addUserToContactList($event->user, "Holidays for [Country_name] Deactivated because from Trial to Free");
                $sGS->addUserToContactList($event->user, "Google Updates Deactivated from Trial to Free");
                $sGS->addUserToContactList($event->user, "Retail Marketing Dates Deactivated from Trial to Free");
                $sGS->addUserToContactList($event->user, "News Alerts for [keywords] Deactivated because from Trial to Free");
                $sGS->addUserToContactList($event->user, "Weather for [cities] Deactivated from Trial to Free");
                $sGS->addUserToContactList($event->user, "WordPress Deactivated because from Trial to Free");
                break;

            case 'App\Events\AnnotationsLimitReached':
                $sGS->addUserToContactList($event->user, "Annotation limits reached");
                break;

            case 'App\Events\UserClickedAnnotationButtonInBrowser':
                $sGS->addUserToMarketingList($event->user, "13 GAa submit your feedback to GA");
                break;

            case 'App\Events\ChromeExtensionFirstAnnotationCreated':
                $sGS->addUserToMarketingList($event->user, "13 GAa submit your feedback to GA");
                break;
        }
    }
}
