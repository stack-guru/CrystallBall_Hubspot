<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use App\Models\User;
use App\Services\SendGridService;

class ProcessNonAPIUsingUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-non-api-using-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all users who registered 4 days ago and have not generated any API token from interface.';

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
        print "Looking for users having no api key generated through interface and registered on " . Carbon::now()->subDays(4)->format("Y-m-d") . "\n";

        $users = User::whereNull('last_generated_api_token_at')->whereRaw("DATE(created_at) = '" . Carbon::now()->subDays(4)->format("Y-m-d") . "'")->get()->toArray();
        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "5 GAa active API");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
