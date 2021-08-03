<?php

namespace App\Console\Commands;

use App\Models\RetailMarketing;
use App\Models\User;
use App\Notifications\RetailMarketingEvent as RetailMarketingEventNotification;
use App\Notifications\RetailMarketingTomorrow as RetailMarketingTomorrowNotification;
use App\Notifications\RetailMarketingWeek as RetailMarketingWeekNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class GenerateRetailMarketingDateNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:generate-retail-marketing-date-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will generate events if there is any retail marketing date added for users.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Today
        $retailMarketings = RetailMarketing::where('show_at', Carbon::now()->format('Y-m-d'))->get();
        if (count($retailMarketings)) {
            print "Sending retail marketing date notification of " . count($retailMarketings) . " event(s).\n";
            foreach ($retailMarketings as $index => $retailMarketing) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('retail_marketings', 'retail_marketings.id', 'user_data_sources.retail_marketing_id')
                    ->where('retail_marketings.id', $retailMarketing->id)

                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'retail_marketing_dates')
                    ->where('notification_settings.is_enabled', true)

                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new RetailMarketingEventNotification($retailMarketing));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }

        // Tomorrow
        $retailMarketings = RetailMarketing::where('show_at', Carbon::now()->addDays(1)->format('Y-m-d'))->get();
        if (count($retailMarketings)) {
            print "Sending retail marketing date notification of " . count($retailMarketings) . " event(s).\n";
            foreach ($retailMarketings as $index => $retailMarketing) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('retail_marketings', 'retail_marketings.id', 'user_data_sources.retail_marketing_id')
                    ->where('retail_marketings.id', $retailMarketing->id)

                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'retail_marketing_dates')
                    ->where('notification_settings.is_enabled', true)

                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new RetailMarketingTomorrowNotification($retailMarketing));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }

        // Week
        $retailMarketings = RetailMarketing::where('show_at', Carbon::now()->addDays(7)->format('Y-m-d'))->get();
        if (count($retailMarketings)) {
            print "Sending retail marketing date notification of " . count($retailMarketings) . " event(s).\n";
            foreach ($retailMarketings as $index => $retailMarketing) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('retail_marketings', 'retail_marketings.id', 'user_data_sources.retail_marketing_id')
                    ->where('retail_marketings.id', $retailMarketing->id)

                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'retail_marketing_dates')
                    ->where('notification_settings.is_enabled', true)

                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new RetailMarketingWeekNotification($retailMarketing));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }
    }
}
