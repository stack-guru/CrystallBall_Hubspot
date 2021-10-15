<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();

        // Every minute
        $schedule->command('gaa:process-non-installed-extension-users')->everyMinute();
        $schedule->command('gaa:check-monitor-statuses')->everyMinute();

        // Every ten minute
        $schedule->command('gaa:send-new-data-sources-email')->everyTenMinutes();

        // Every hour
        $schedule->command('gaa:fetch-weather-alerts')->withoutOverlapping()->hourly();

        // Everyday
        $schedule->command('gaa:process-no-annotation-users')->daily();
        $schedule->command('gaa:process-non-api-using-users')->daily();
        $schedule->command('gaa:process-non-upgrading-users')->daily();
        $schedule->command('gaa:process-not-enabled-data-source-users')->daily();
        $schedule->command('gaa:process-trial-expired-users')->daily();
        $schedule->command('gaa:process-two-days-old-free-users')->daily();
        $schedule->command('gaa:process-thirty-days-old-free-users')->daily();
        $schedule->command('gaa:resubscribe-user-plans')->daily();                              // must stay in place
        $schedule->command('gaa:fetch-adwords-keywords-clicks')->daily();
        $schedule->command('gaa:fetch-google-alerts')->daily();
        // Everyday Notifications
        $schedule->command('gaa:generate-google-alert-notification')->daily();
        $schedule->command('gaa:generate-google-algorithm-update-notification')->daily();
        $schedule->command('gaa:generate-retail-marketing-date-notification')->daily();
        $schedule->command('gaa:generate-holiday-notification')->daily();
        $schedule->command('gaa:generate-weather-alert-notification')->daily();
        $schedule->command('gaa:generate-wordpress-update-notification')->daily();
        // Everyday non critical
        $schedule->command('gaa:fetch-google-analytics-metrics-and-dimensions')->daily();

        // Every month
        $schedule->command('gaa:send-card-expiry-mail')->monthly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
