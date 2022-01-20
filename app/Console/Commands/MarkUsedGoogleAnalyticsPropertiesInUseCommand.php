<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MarkUsedGoogleAnalyticsPropertiesInUseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:mark-used-google-analytics-properties-in-use';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will fetch used google analytics property ids from annotations ga properties table and will mark them as in use in google analytics properties table.';

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

        $this->info(DB::update("
            UPDATE google_analytics_properties
            INNER JOIN annotation_ga_properties ON google_analytics_properties.id = annotation_ga_properties.google_analytics_property_id
            SET is_in_use = 1;
        ") . " rows updated.");
        return 0;
    }
}
