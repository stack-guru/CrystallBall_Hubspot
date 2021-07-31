<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\SendGridService;

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

        info(get_class($event));

        switch(get_class($event)){
            case 'App\Events\NewCSVFileUploaded':
                $sGS->addUserToContactList($event->user, "New CSV [file name] Uploaded", ['file_name' => $event->fileName]);
                break;
            case 'App\Events\HolidaysDeactivatedManually':
                $sGS->addUserToContactList($event->user, "Holidays for [Country_name] Deactivated manually");
                break;
        }
    }
}
