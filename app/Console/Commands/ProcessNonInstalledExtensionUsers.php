<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\SendGridService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ProcessNonInstalledExtensionUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-non-installed-extension-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will add users to a sendgrid list who have not logged into chrome extension aftering registering an hour before.';

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

        print "Looking for users registered between " . Carbon::now()->subHours(1)->format("Y-m-d H:i:00") . " and " . Carbon::now()->subHours(1)->subMinutes(1)->format("Y-m-d H:i:00") . "\n";

        $users = User::whereBetween('created_at', [Carbon::now()->subHours(1)->subMinutes(1)->format("Y-m-d H:i:00"), Carbon::now()->subHours(1)->format("Y-m-d H:i:00")])->whereNull('last_logged_into_extension_at')->get()->toArray();
        if(count($users)){
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "2 GAa Register but didn’t install the extension");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
