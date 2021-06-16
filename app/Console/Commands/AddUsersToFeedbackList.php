<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use App\Models\PricePlan;
use App\Services\SendGridService;
use DB;

class AddUsersToFeedbackList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:add-users-to-feedback-list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Consider all users who are fulling using our application and add them to request feedback list';

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
        $userIdsArray = DB::select("SELECT TempTable.uId, cAId, user_created_at FROM ( SELECT users.id AS uId, COUNT(annotations.id) cAId, DATE(users.created_at) AS user_created_at FROM users INNER JOIN annotations ON annotations.user_id = users.id WHERE users.last_activated_any_data_source_at IS NOT NULL AND users.last_generated_api_token_at IS NOT NULL GROUP BY users.id ) AS TempTable WHERE cAId > 4");
        $userIds = array_map(function ($u) {return $u->uId;}, $userIdsArray);
        $users = User::whereIn('id', $userIds)->get()->toArray();

        if (count($users)) {
            $sGS = new SendGridService;
            $sGS->addUsersToMarketingList($users, "13 GAa submit your feedback to GA");
        }

        print count($users) . " users have been processed.\n";
        return 0;
    }
}
