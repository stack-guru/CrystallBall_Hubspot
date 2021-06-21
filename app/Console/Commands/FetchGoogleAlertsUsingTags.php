<?php

namespace App\Console\Commands;

use App\Models\GoogleAlert;
use App\Models\UserDataSource;
use App\Services\GoogleAlertService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FetchGoogleAlertsUsingTags extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:fetch-google-alerts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Google Alerts using saved tags in database';

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
        $googleAlertService = new GoogleAlertService;
        $keywords = UserDataSource::selectRaw('LOWER(value) as Lvalue')
            ->where('ds_code', 'google_alert_keywords')
            ->whereNotNull('value')
            ->orderBy('Lvalue')
            ->distinct()
            ->get()->pluck('Lvalue')->toArray();

        $alertDate = new Carbon;
        foreach ($keywords as $keyword) {
            $allAlerts = $googleAlertService->getAllFeeds($keyword);
            if ($allAlerts !== false) {
                foreach ($allAlerts as $categoryName => $categoryAlert) {
                    foreach ($categoryAlert as $alert) {
                        if (stripos($alert['title'], $keyword) || stripos($alert['description'], $keyword)) {
                            if (!GoogleAlert::where('url', $alert['url'])->count()) {
                                $googleAlert = new GoogleAlert;
                                $googleAlert->alert_date = $alertDate;
                                $googleAlert->tag_name = $keyword;
                                $googleAlert->category = $categoryName;
                                $googleAlert->title = $alert['title'];
                                $googleAlert->url = $alert['url'];
                                $googleAlert->description = $alert['description'];

                                if (array_key_exists('image', $alert)) {
                                    $googleAlert->image = $alert['image'];
                                }

                                $googleAlert->save();
                            }
                        }
                    }
                }
            }
        }
        return 0;
    }
}
