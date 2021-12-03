<?php

namespace App\Console\Commands;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use App\Models\User;
use App\Services\SendGridService;

class ProcessNonUpgradingUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-non-upgrading-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all users who registered 12 days ago and have not upgraded to any paid plan till now.';

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
        print "Looking for users still on trial plan and registered on " . Carbon::now()->subDays(12)->format("Y-m-d") . " and plan expiring on " . Carbon::now()->addDays(2)->format("Y-m-d") . "\n";

        $users = User::whereRaw("DATE(price_plan_expiry_date) = '" . Carbon::now()->addDays(2)->format("Y-m-d") . "'")->whereRaw("DATE(created_at) = '" . Carbon::now()->subDays(12)->format("Y-m-d") . "'")->get()->toArray();
        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "6 GAa Two days until Trial ends");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
