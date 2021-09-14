<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use App\Models\User;
use App\Services\SendGridService;

class ProcessNoAnnotationUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:process-no-annotation-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add users to list if they havent added any annotation even after a day';

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
        print "Looking for users having no annotation but registered yesterday " . Carbon::now()->subDays(1)->format("Y-m-d") . "\n";

        // SELECT TempTable.uId FROM (  SELECT users.id AS uId, COUNT(annotations.id) cAId FROM users LEFT JOIN annotations ON annotations.user_id = users.id WHERE users.created_at = '2021-01-08'  GROUP BY users.id        )         AS TempTable        WHERE cAId < 2
        $userIdsArray = DB::select("SELECT TempTable.uId, cAId, user_created_at FROM ( SELECT users.id AS uId, COUNT(annotations.id) cAId, DATE(users.created_at) AS user_created_at FROM users LEFT JOIN annotations ON annotations.user_id = users.id  GROUP BY users.id ) AS TempTable WHERE cAId < 2 AND user_created_at = '" . Carbon::now()->subDays(1)->format("Y-m-d") . "'");
        $userIds = array_map(function ($u) {return $u->uId;}, $userIdsArray);
        $users = User::whereIn('id', $userIds)->get()->toArray();
        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "3 GAa create your fist annotation");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
