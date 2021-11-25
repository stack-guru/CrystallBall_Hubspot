<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Annotation;
use App\Models\UserWebhook;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class RunZapierHookForCreatedAnnotation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $annotation, $userWebhook;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Annotation $annotation, UserWebhook $userWebhook)
    {
        $this->annotation = $annotation;
        $this->userWebhook = $userWebhook;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        $response = Http::{$this->userWebhook->request_method}($this->userWebhook, $this->annotation);

        if ($response->successful()) {
            $this->userWebhook->last_executed_at = Carbon::now();
            $this->userWebhook->executions_count++;
            $this->userWebhook->save();
        }
    }
}
