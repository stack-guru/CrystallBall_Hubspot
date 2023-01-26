<?php

namespace App\Console\Commands;

use App\Models\GoogleAnalyticsProperty;
use Illuminate\Console\Command;

class AssignColorToEveryGoogleAnalyticsProperty extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:assign-colors-to-every-google-analytics-property';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command randomly assigns a color to all GA properties that are missing colors';

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
        $googleAnalyticsProperties = GoogleAnalyticsProperty::whereNull('color_hex_code')->get();
        $this->comment(count($googleAnalyticsProperties) . ' properties to process!');

        $colors = GoogleAnalyticsProperty::getColors();

        $bar = $this->output->createProgressBar(count($googleAnalyticsProperties));

        $bar->start();
        foreach ($googleAnalyticsProperties as $googleAnalyticsProperty) {
            $googleAnalyticsProperty->color_hex_code = $colors[rand(0, count($colors) - 1)];
            $googleAnalyticsProperty->save();
            $bar->advance();
        }
        $bar->finish();
        $this->newLine();
        $this->info(count($googleAnalyticsProperties) . ' properties processed successfully!');

        return 0;
    }
}
