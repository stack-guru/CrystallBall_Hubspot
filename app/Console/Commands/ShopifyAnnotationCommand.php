<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ShopifyAnnotation;
use App\Models\ShopifyMonitor;
use App\Models\UserDataSource;
use App\Services\ShopifyService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ShopifyAnnotationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:shopify-annotation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch event name, category and description from Shopify Account';

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

        $sMonitors = ShopifyMonitor::get();
        $shopifyService = new ShopifyService();
        foreach($sMonitors as $monitor) {
            if ($monitor->events) {
                $products    = $shopifyService->getShopifyProducts($monitor->url);
                if (!$products) {
                    Log::channel('shopify')->debug('Url is not loaded!');
                    return false;
                }
                $shopifyData = $shopifyService->saveShopifyProducts(json_decode($monitor->events), $products, $monitor->user_id, $monitor->id);
                $monitor->last_synced_at = Carbon::now();
                $monitor->save();
            }
        }
    }
}
