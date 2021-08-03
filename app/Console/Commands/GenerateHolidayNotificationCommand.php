<?php

namespace App\Console\Commands;

use App\Models\Holiday;
use App\Models\User;
use App\Notifications\HolidayEvent as HolidayEventNotification;
use App\Notifications\HolidayTomorrow as HolidayTomorrowNotification;
use App\Notifications\HolidayWeek as HolidayWeekNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class GenerateHolidayNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:generate-holiday-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will generate events if there is any holiday added for users.';

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
        $holidays = Holiday::where('holiday_date', Carbon::now()->format('Y-m-d'))->get();
        if (count($holidays)) {
            print "Sending holiday notification of " . count($holidays) . " event(s).\n";
            foreach ($holidays as $index => $holiday) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('holidays', 'holidays.country_name', 'user_data_sources.country_name')
                    ->where('holidays.id', $holiday->id)

                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'retail_marketing_dates')
                    ->where('notification_settings.is_enabled', true)

                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new HolidayEventNotification($holiday));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }

        // Tomorrow
        $holidays = Holiday::where('holiday_date', Carbon::now()->addDays(1)->format('Y-m-d'))->get();
        if (count($holidays)) {
            print "Sending holiday notification of " . count($holidays) . " event(s).\n";
            foreach ($holidays as $index => $holiday) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('holidays', 'holidays.country_name', 'user_data_sources.country_name')
                    ->where('holidays.id', $holiday->id)

                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'retail_marketing_dates')
                    ->where('notification_settings.is_enabled', true)

                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new HolidayTomorrowNotification($holiday));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }

        // Week
        $holidays = Holiday::where('holiday_date', Carbon::now()->addDays(7)->format('Y-m-d'))->get();
        if (count($holidays)) {
            print "Sending holiday notification of " . count($holidays) . " event(s).\n";
            foreach ($holidays as $index => $holiday) {
                $users = User::select('users.*')
                    ->join('user_data_sources', 'user_data_sources.user_id', 'users.id')
                    ->join('holidays', 'holidays.country_name', 'user_data_sources.country_name')
                    ->where('holidays.id', $holiday->id)

                    ->join('notification_settings', 'users.id', 'notification_settings.user_id')
                    ->where('notification_settings.name', 'retail_marketing_dates')
                    ->where('notification_settings.is_enabled', true)

                    ->get();
                print "Sending notification to " . count($users) . " users.\n";
                Notification::send($users, new HolidayWeekNotification($holiday));
            }
            print "Notification sent successfully!\n";
        } else {
            print "No notification to send.\n";
        }
    }
}
