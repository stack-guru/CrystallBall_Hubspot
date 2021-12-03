<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class MarkChecklistItemCompleted
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
        if (get_class($event) == 'Laravel\Passport\Events\AccessTokenCreated') {
            $userId = $event->userId;
        } else {
            $userId = $event->user->id;
        }
        $currentDateTime = Carbon::now();

        switch (get_class($event)) {
                /////////////////////////////////////////////////////
                // Annotation Events
            case 'App\Events\NewCSVFileUploaded':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'IMP_ANN_CSV'
                ");
                break;

                /////////////////////////////////////////////////////
                // Data Source Events
            case 'App\Events\WebsiteMonitoringActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_WEB_MON'
                ");
                break;
            case 'App\Events\GoogleAlertActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_GOOG_ALERT'
                ");
                break;
            case 'App\Events\GoogleUpdatesActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_GOOG_UPD'
                ");
                break;
            case 'App\Events\RetailMarketingDatesActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_RET_MKT_DTE'
                ");
                break;
            case 'App\Events\HolidaysActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_HOLIDAYS'
                ");
                break;
            case 'App\Events\WordPressActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_WP_UPDATES'
                ");
                break;
            case 'App\Events\WeatherActivated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'AUTO_WEA_ALERTS'
                ");
                break;
            case 'App\Events\UserUsedApiForFirstTime':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'CONN_A_TOOL'
                ");
                break;

            case 'App\Events\UserInvitedTeamMember':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND checklist_items.name = 'INV_TEAM'
                ");
                break;
            case 'Laravel\Passport\Events\AccessTokenCreated':
                DB::statement("
                    UPDATE user_checklist_items INNER JOIN checklist_items ON checklist_items.id = user_checklist_items.checklist_item_id
                    SET user_checklist_items.completed_at = '$currentDateTime'
                    WHERE
                        user_checklist_items.user_id = $userId
                        AND user_checklist_items.completed_at IS NULL
                        AND (
                            checklist_items.name = 'CONN_ADWORDS' OR checklist_items.name = 'CONN_MAILCHIMP'
                            OR checklist_items.name = 'CONN_SHOPIFY' OR checklist_items.name = 'CONN_SLACK'
                            OR checklist_items.name = 'CONN_ASANA' OR checklist_items.name = 'CONN_JIRA'
                            OR checklist_items.name = 'CONN_TRELLO' OR checklist_items.name = 'CONN_GITHUB'
                            OR checklist_items.name = 'CONN_BITBUCKET' OR checklist_items.name = 'CONN_GOOG_SHTS'
                            OR checklist_items.name = 'CONN_A_TOOL'
                        )
                ");
                break;
        }
    }
}
