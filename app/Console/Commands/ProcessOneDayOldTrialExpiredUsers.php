<?php

namespace App\Console\Commands;

use App\Models\PricePlan;
use App\Models\User;
use App\Services\SendGridService;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class ProcessOneDayOldTrialExpiredUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-one-day-old-trial-expired-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all users who ended trial 1 day ago and are using not using the system';

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
        $trialEndedPlanId = PricePlan::where('name', PricePlan::TRIAL_ENDED)->first()->id;
        print "Looking for users whos are on trial ended plan but trial ended on " . Carbon::now()->subDays(1)->format("Y-m-d") . "\n";

        $users = User::whereRaw("DATE(trial_ended_at) = '" . Carbon::now()->subDays(1)->format("Y-m-d") . "'")
            ->whereNotNull('trial_ended_at')
            ->where("price_plan_id", $trialEndedPlanId)
            ->get()
            ->toArray();

        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToContactList($users, "Website Monitoring Deactivated because Trial to Free");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
