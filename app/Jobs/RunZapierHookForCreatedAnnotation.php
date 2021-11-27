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

        $response = Http::{$this->userWebhook->request_method}($this->userWebhook->endpoint_uri, [
            "category" => $this->annotation->category,
            "event_name" => $this->annotation->event_name,
            "show_at" => Carbon::parse($this->annotation->show_at)->toIso8601String(),
            "user_id" => $this->annotation->user_id,
            "is_enabled" => $this->annotation->is_enabled,
            "added_by" => $this->annotation->added_by,
            "updated_at" => Carbon::parse($this->annotation->updated_at)->toIso8601String(),
            "created_at" => Carbon::parse($this->annotation->created_at)->toIso8601String(),
            "id" => $this->annotation->id
        ]);

        if ($response->successful()) {
            $this->userWebhook->last_executed_at = Carbon::now();
            $this->userWebhook->executions_count++;
            $this->userWebhook->save();
        }
    }
}
