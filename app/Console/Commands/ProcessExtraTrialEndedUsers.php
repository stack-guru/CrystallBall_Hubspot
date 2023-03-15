<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Carbon;
use App\Models\PricePlan;
use App\Services\SendGridService;

class ProcessExtraTrialEndedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-extra-trial-ended-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add all users to a list whos trial plan ended today';

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
        $trialPlanId = PricePlan::where('name', PricePlan::TRIAL)->first()->id;
        print "Looking for users whos trial are ended today " . Carbon::now()->format("Y-m-d") . "\n";

        $all_users = User::whereRaw("DATE(trial_ended_at) = '" . Carbon::now()->format("Y-m-d") . "'")->where("price_plan_id", $trialPlanId)->get();
        $users = [];
        foreach($all_users as $user)
        {
            if($user->price_plan_settings && $user->price_plan_settings->extended_trial->activation_count == 1)
                $users[] = $user;
        }
        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "Extra Trial ends Today");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
