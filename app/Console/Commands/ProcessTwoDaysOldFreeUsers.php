<?php

namespace App\Console\Commands;

use App\Models\PricePlan;
use App\Models\User;
use App\Services\SendGridService;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class ProcessTwoDaysOldFreeUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-two-days-old-free-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all users who left trial 2 days ago and are using free plan';

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
        $freePlanId = PricePlan::where('code', PricePlan::CODE_FREE_NEW)->first()->id;
        print "Looking for users whos are on free plan but trial ended on " . Carbon::now()->subDays(2)->format("Y-m-d") . "\n";

        $users = User::whereRaw("DATE(trial_ended_at) = '" . Carbon::now()->subDays(2)->format("Y-m-d") . "'")
            ->whereNotNull('trial_ended_at')
            ->where("price_plan_id", $freePlanId)
            ->get()
            ->toArray();

        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "2 days on FREE");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
