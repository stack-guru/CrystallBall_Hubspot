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

        $schedule->command('gaa:process-non-installed-extension-users')->everyMinute();
        
        $schedule->command('gaa:process-no-annotation-users')->daily();
        $schedule->command('gaa:process-non-api-using-users')->daily();
        $schedule->command('gaa:process-non-upgrading-users')->daily();
        $schedule->command('gaa:process-not-enabled-data-source-users')->daily();
        $schedule->command('gaa:process-trial-expired-users')->daily();
        $schedule->command('gaa:process-thirty-days-old-free-users')->daily();
        $schedule->command('gaa:resubscribe-user-plans')->daily();
                
        $schedule->command('gaa:send-card-expiry-mail')->monthly();

        

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
