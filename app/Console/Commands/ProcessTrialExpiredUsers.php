<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Carbon;
use App\Models\PricePlan;
use App\Services\SendGridService;

class ProcessTrialExpiredUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-trial-expired-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add all users to a list whos trial plan expired yesterday';

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
        print "Looking for users whos are on trial but registered on " . Carbon::now()->subDays(14)->format("Y-m-d") . "\n";

        $users = User::whereRaw("DATE(created_at) = '" . Carbon::now()->subDays(14)->format("Y-m-d") . "'")->where("price_plan_id", $trialPlanId)->get()->toArray();
        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "7 GAa Today Trial ends");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
