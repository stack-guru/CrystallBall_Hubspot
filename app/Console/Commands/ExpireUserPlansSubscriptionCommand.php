<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\PricePlan;

class ExpireUserPlansSubscriptionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:expire-user-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will mark all expired plans as expired and subscribe user to free plan.';

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
        User::where('price_plan_expiry_date', '<', new \DateTime)->update([
            'price_plan_id' => PricePlan::where('price', 0.00)->where('is_enabled', true)->first()->id,
            'price_plan_expiry_date' => new \DateTime("+1 month")
        ]);
        return 0;
    }
}
