<?php

namespace App\Console\Commands;

use App\Models\PricePlan;
use App\Models\User;
use App\Services\SendGridService;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;

class ProcessThirtyDaysOldFreeUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-thirty-days-old-free-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all users who registered 30 days ago and are using free plan';

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
        $freePlanId = PricePlan::where('name', PricePlan::FREE)->first()->id;
        print "Looking for users whos are on free plan but registered on " . Carbon::now()->subDays(30)->format("Y-m-d") . "\n";

        $users = User::whereRaw("DATE(created_at) = '" . Carbon::now()->subDays(30)->format("Y-m-d") . "'")
            ->where("price_plan_id", $freePlanId)
            ->get()
            ->toArray();

        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "8 GAa 30 days on FREE");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
