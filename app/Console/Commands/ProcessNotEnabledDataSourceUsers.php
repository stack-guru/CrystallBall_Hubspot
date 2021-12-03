<?php

namespace App\Console\Commands;


use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use App\Models\User;
use App\Services\SendGridService;

class ProcessNotEnabledDataSourceUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-not-enabled-data-source-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It will gather all users registered 3 days ago and have not enabled data source feature ever since.';

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
        print "Looking for users havent enabled data sources and registered on " . Carbon::now()->subDays(3)->format("Y-m-d") . "\n";

        $users = User::whereNull('last_activated_any_data_source_at')->whereRaw("DATE(created_at) = '" . Carbon::now()->subDays(3)->format("Y-m-d") . "'")->get()->toArray();
        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "4 GAa active Data Source");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
