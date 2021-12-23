<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Annotation;
use App\Models\WebMonitorAnnotation;

class TransferAnnotationsToWebMonitorAnnotations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:transfer-annotations-to-web-monitor-annotations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will move all annotations with value Website Monitoring from annotations table to web_monitor_annotations table.';

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
        $annotations = Annotation::where('category', "Website Monitoring")->get();
        $this->info("Found " . count($annotations) . " annotations from annotations table.");
        foreach ($annotations as $annotation) {
            $webMonitorAnnotation = new WebMonitorAnnotation;
            $webMonitorAnnotation->user_id = $annotation->user_id;
            $webMonitorAnnotation->category = $annotation->category;
            $webMonitorAnnotation->event_name = $annotation->event_name;
            $webMonitorAnnotation->description = $annotation->description;
            $webMonitorAnnotation->show_at = $annotation->show_at;

            $webMonitorAnnotation->timestamps = false;
            $webMonitorAnnotation->created_at = $annotation->created_at;
            $webMonitorAnnotation->updated_at = $annotation->updated_at;

            $webMonitorAnnotation->save();
            $annotation->delete();
        }
        $this->info("Successfully moved all annotations to web monitor annotations table.");
        return 0;
    }
}
