<?php

namespace App\Console\Commands;

use App\Models\PricePlan;
use App\Models\User;
use App\Services\SendGridService;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class ProcessTwoDaysOldTrialExpiredUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-two-days-old-trial-expired-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all users who ended trial 2 days ago and are using not using the system';

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
        $trialEndedPlanId = PricePlan::where('code', PricePlan::CODE_FREE_NEW)->first()->id;
        print "Looking for users whos are on trial ended plan but trial ended on " . Carbon::now()->subDays(2)->format("Y-m-d") . "\n";

        $users = User::whereRaw("DATE(trial_ended_at) = '" . Carbon::now()->subDays(2)->format("Y-m-d") . "'")
            ->whereNotNull('trial_ended_at')
            ->where("price_plan_id", $trialEndedPlanId)
            ->get()
            ->toArray();

        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "2 days after trial ended - appsumo coupon");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
